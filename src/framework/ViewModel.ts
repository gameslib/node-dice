
/**
  *  ViewModel Class
  *  Wraps a javascript object and modifies the
  *  property descriptors of each of its primative
  *  properties. The modification adds a 'setter'
  *  method that calls the 'notifyPropertyChanged' method.
  *
  *  Adds a public method 'onPropertyChanged' to the object.
  *  This method allows registering for property change
  *  notifications.

  *  Adds a public method 'notifyPropertyChanged' to the object.
  *  this method fires a property-change notification event.
  *
  *  @class ViewModel
  */
class ViewModel {

  // keyed collection of subscription callbacks
  private subscribers: subscription
  private scope: string
  private model: {}
  private view: iView


  // creates a new ViewModel
  constructor(model: any, view: iView, options: any) {
    this.subscribers = {}
    this.scope = options.scope
    this.model = model
    this. view = view
    this.getOwnPrimativeProperties(model)
  }

  /**
   *  private ViewModel.getOwnPrimativeProperties
   *  Find all properties of the object, ignoring
   *  functions and non-primitive properties.
   *
   *	@class ViewModel
   *	@method getOwnPrimativeProperties
   *	@param obj {Object} the object to be examined
   */
  private getOwnPrimativeProperties(obj: any) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // filter primative properties only (no objects, arrays or functions)
        if (!Object.prototype.isPrototypeOf(obj[key])) {
          this.makeObservable(obj, key)
        }
      }
    }
  }

  /**
   *	private ViewModel.makeObservable
   *  Create a new property deinition that adds a setter function
   *  that will call our notifyPropertyChanged method whenever the
   *  property value has been changed.
   *
   *	@class ViewModel
   *	@method makeObservable
   *	@param obj {object}
   *	@param key {string}
   *	@return propertyValue {any}
   */
  private makeObservable(obj: any, key: string) {
    let propertyValue = obj[key]
    let self = this
    Object.defineProperty(self, key, {
      get() {
        return propertyValue
      },
      set(newValue) {
        // only notify if the value has actually changed
        if (propertyValue !== newValue) {
          propertyValue = newValue
          self.notifyPropertyChanged(key)
        }
      }
    })
  }

  /**
   *	public ViewModel.onPropertyChanged
   *  registers a callback function to be notified of a property change event
   *
   *	@class ViewModel
   *	@method onPropertyChanged
   *	@param propertyName {string}
   *	@param callBack {onChangeCallback}
   */
  public onPropertyChanged(propertyName: string, callBack: onChangeCallback) {
    // if this property has never been registered, create a new subscription property
    if (!this.subscribers[propertyName]) this.subscribers[propertyName] = []
    // add this new callback function to the array of callbacks subscribing to this property
    this.subscribers[propertyName].push(callBack)
  }

  /**
   *	public ViewModel.notifyPropertyChanged
   *  notify that a property value has changed
   *  (executes all callback functions that have subscribed to this propertyName)
   *
   *	@class ViewModel
   *	@method notifyPropertyChanged
   *	@param propertyName {string} the property of interest
   */
  public notifyPropertyChanged(propertyName: string) {
    // if this property has no registered subscribers (listeners), just return
    if (!this.subscribers[propertyName] || this.subscribers[propertyName].length < 1) return
    let updatedValue = this[propertyName]
    // execute each registered callback function, registered for this property
    // passing-back the updated property value
    this.subscribers[propertyName].forEach((notify: onChangeCallback) => notify(updatedValue))
    // For all their utility, event handlers have one problematic side effect:
    // they can create a tight coupling between the instance that exposes the event
    // and the instance that subscribes to it.
    Events.fire(this.scope + '.' + propertyName, { newValue: updatedValue })
  }
} // end class

/**
 * Interface that describes the signature of an
 * 'onChanged' callback function
*/
interface onChangeCallback {
  // a callback function that recieves a
  // new property 'value' and returns nothing
  (newValue: any): void;
}

/**
 * Interface describing a subscription entry
 * for the subscriptions collection object.
 * Each member, a property whose key is a property-name,
 * holds an array of onChangeCallback functions
 */
interface subscription {
  // a collection of property names,
  // each containing an array of callback functions
  [propertyName: string]: onChangeCallback[];
}

