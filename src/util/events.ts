class Events {
  private static registeredEvents: {}

  static on(event: string, listener: any) {
    Events.registerListener(event, listener, false)
  }

  static once(event: string, listener: any){
    Events.registerListener(event, listener, true)
  }

  private static registerListener(event: string, listener: any, once: boolean) {
    if (!Events.exists(event)) {
      Events.registeredEvents[event] = []
    }
    let index = Events.registeredEvents[event].push(
      {
        index: Events.registeredEvents[event].length,
        callback: listener,
        onlyOnce: once
      }) - 1
    return {
      remove: function () {
        delete Events.registeredEvents[event][index]
      }
    }
  }

  static fire(thisEvent: string, data: any) {
    if (!Events.exists(thisEvent)) return;
    Events.registeredEvents[thisEvent].forEach(function (subscription: any) {
      subscription.callback(data != undefined ? data : {});
      if (subscription.onlyOnce) {
        delete Events.registeredEvents[thisEvent][subscription.index]
      }
    })
  }

  private static exists(thisEvent: string) {
    Events.registeredEvents = Events.registeredEvents || {}
    return Events.registeredEvents.hasOwnProperty(thisEvent)
  }

  static reset() {
      Events.registeredEvents = {}
  }
}

/**   usage
 *
  // firing an event
  //        event-name,  any argument
  Events.fire('click', { msg: 'was clicked' } )

  // subscribe to event in order to be notified of each firing
  var subscription = Events.on('click', function(obj) {
	  // Do something now that the event has fired
  })

  // subscribing to event to be notified only once
  var subscription = Events.once('click', function(obj) {
	  // Do something now that the event has fired
  })
  // sometime later where I no longer want the subscription
  subscription.remove();

*/