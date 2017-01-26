// hack: don't forget to use Object destructuring tricks
/*
    const { name } = player; // pulls the 'name'  property from player object
    console.log(name)
*/

var ViewContainer = Observable.extend({
  init: function (container) {
    Observable.fn.init.call(this);
    this.container = container;
    this.history = [];
    this.view = null;
    this.running = false;
  },

  after: function () {
    this.running = false;
    this.trigger("complete", { view: this.view });
    this.trigger("after");
  },

  end: function () {
    this.view.showEnd();
    this.previous.hideEnd();
    this.after();
  },

  show: function (view, transition, locationID) {
    if (!view.triggerBeforeShow() || (this.view && !this.view.triggerBeforeHide())) {
      this.trigger("after");
      return false;
    }

    locationID = locationID || view.id;

    var that = this,
      current = (view === that.view) ? view.clone() : that.view,
      history = that.history,
      previousEntry = history[history.length - 2] || {},
      back = previousEntry.id === locationID,
      // If explicit transition is set, it will be with highest priority
      // Next we will try using the history record transition or the view transition configuration
      theTransition = transition || (back ? history[history.length - 1].transition : view.transition),
      transitionData = parseTransition(theTransition);

    if (that.running) {
      that.effect.stop();
    }

    if (theTransition === "none") {
      theTransition = null;
    }

    that.trigger("accepted", { view: view });
    that.view = view;
    that.previous = current;
    that.running = true;

    if (!back) {
      history.push({ id: locationID, transition: theTransition });
    } else {
      history.pop();
    }

    if (!current) {
      view.showStart();
      view.showEnd();
      that.after();
      return true;
    }

    if (!theTransition || !kendo.effects.enabled) {
      view.showStart();
      that.end();
    } else {
      // hide the view element before init/show - prevents blinks on iPad
      // the replace effect will remove this class
      view.element.addClass("k-fx-hidden");
      view.showStart();
      // do not reverse the explicit transition
      if (back && !transition) {
        transitionData.reverse = !transitionData.reverse;
      }

      that.effect = kendo.fx(view.element).replace(current.element, transitionData.type)
        .beforeTransition(function () {
          view.beforeTransition("show");
          current.beforeTransition("hide");
        })
        .afterTransition(function () {
          view.afterTransition("show");
          current.afterTransition("hide");
        })
        .direction(transitionData.direction)
        .setReverse(transitionData.reverse);

      that.effect.run().then(function () { that.end(); });
    }

    return true;
  }
});
