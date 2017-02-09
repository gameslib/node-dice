
class Events {
  static Type = {
    GameOver:     'GameOver',     // socketSend-containerVM:79, Events.on-containerVM:85, Events.fire-containerVM:94
    RegisterPlayer:     'RegisterPlayer',     // socketSend-containerVM:104
    MouseDown:    'mousedown',    // keep lowercase canvas.addEventListener-container:27
    PlayerRolled: 'PlayerRolled', // socketSend containerVM:115
    ResetGame:    'ResetGame',    // socket.on.message containerVM:69, Events.on-containerVM:78
    ResetTurn:    'ResetTurn',    // socket on-message-recieved type containerVM:59
    RollButtonClicked: 'RollButtonClicked', // Events.on-containerVM:100
    RollUpdate:   'RollUpdate',   // Events.fire-containerVM:143
    TouchStart:   'touchstart',   // keep lowercase  canvas.addEventListener-container:31
    TurnOver:     'TurnOver',     // Events.fire-scoreButton:87, Events.on-ContainerVM:92
    UpdateScore:  'UpdateScore',  // socket-on-message-containerVM:56
    UpdateDie:    'UpdateDie',    // socket-on-message-containerVM:53
    UpdateRoll:   'UpdateRoll',   // socket-on-message-containerVM:50
    RegisterPlayers:   'RegisterPlayers'    // socket-on-message-containerVM:47

  }

  private static registeredtopics: {}

  /**
   *	Events.on
   *  registers a callback to be notified when a topic is published
   *	e.g.: Events.on("GameOver", Game.resetGame)
   *
   *	@class Events
   *	@method on
   *	@param topic {String} the topic of interest
   *	@param listener {function} a callback function
   *	@return remove {object} returns an object with a remove function
   */
  static on(topic: string, listener: any) {
    return Events.registerListener(topic, listener, false)
  }

  /**
   *	Events.once
   *  registers a callback to be notified only once when a topic is published
   *	e.g.: Events.once("GameOver", Game.resetGame)
   *
   *	@class Events
   *	@method once
   *	@param topic {String} the topic of interest
   *	@param listener {function} a callback function
   *	@return remove {object} returns an object with a remove function
   */
  static once(topic: string, listener: any) {
    Events.registerListener(topic, listener, true)
  }


  /**
   *	Events.registerListener
   *  registers a callback to be notified only once when a topic is published
   *	e.g.: Events.registerListener("GameOver", Game.resetGame)
   *
   *	@class Events
   *	@method registerListener
   *	@param topic {String} the topic of interest
   *	@param listener {function} a callback function
   *	@param once {boolean} if true ... fire once then unregister
   *	@return remove {object} returns an object with a remove function
   */
  private static registerListener(topic: string, listener: any, once: boolean) {
    if (!Events.exists(topic)) {
      Events.registeredtopics[topic] = []
    }
    let index = Events.registeredtopics[topic].push(
      {
        index: Events.registeredtopics[topic].length,
        callback: listener,
        onlyOnce: once
      }) - 1
    // return an anonomous object with a 'remove' function
    return {
      remove: function () {
        delete Events.registeredtopics[topic][index]
      }
    }
  }

  /**
   *	Events.fire
   *  publishes a topic with optional data
   *	e.g.: Events.fire("GameOver", winner)
   *
   *	@class Events
   *	@method fire
   *	@param topic {String} the topic of interest
   *	@param data {any} optional data to report to subscribers
   */
  static fire(topic: string, data: any) {
    if (!Events.exists(topic)) return;
    Events.registeredtopics[topic].forEach(function (subscription: any) {
      subscription.callback(data != undefined ? data : {});
      if (subscription.onlyOnce) {
        delete Events.registeredtopics[topic][subscription.index]
      }
    })
  }

  /**
   *	Events.exists
   *  tests for an existing topic registeration
   *	e.g.: Events.exists("GameOver")
   *
   *	@class Events
   *	@method exists
   *	@param topic {String} the topic of interest
   *	@return true/false {boolean} returns true if the topic exists
   */
  private static exists(topic: string) {
    Events.registeredtopics = Events.registeredtopics || {}
    return Events.registeredtopics.hasOwnProperty(topic)
  }

  /**
   *	Events.reset
   *  flush all registered subsriptions (listeners)
   *	e.g.: Events.reset()
   *
   *	@class Events
   *	@method reset
   */
  static reset() {
    Events.registeredtopics = {}
  }
}

/**   usage
 *
  // publish a topic (firing an event)
  //       topic,  any argument
  Events.fire('click', { msg: 'was clicked' } )

  // subscribe to event in order to be notified of each firing
  var subscription = Events.on('click', function(obj) {
	  // Do something now that the event has fired
  })

  // subscribing to event to be notified only once
  var subscription = Events.once('click', function(obj) {
	  // Do something now that the event has fired
  })

  // sometime later where you no longer want the subscription
  subscription.remove();

*/