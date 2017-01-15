class Events {
    static on(event, listener) {
        Events.registerListener(event, listener, false);
    }
    static once(event, listener) {
        Events.registerListener(event, listener, true);
    }
    static registerListener(event, listener, once) {
        if (!Events.exists(event)) {
            Events.registeredEvents[event] = [];
        }
        let index = Events.registeredEvents[event].push({
            index: Events.registeredEvents[event].length,
            callback: listener,
            onlyOnce: once
        }) - 1;
        return {
            remove: function () {
                delete Events.registeredEvents[event][index];
            }
        };
    }
    static fire(thisEvent, data) {
        if (!Events.exists(thisEvent))
            return;
        Events.registeredEvents[thisEvent].forEach(function (subscription) {
            subscription.callback(data != undefined ? data : {});
            if (subscription.onlyOnce) {
                delete Events.registeredEvents[thisEvent][subscription.index];
            }
        });
    }
    static exists(thisEvent) {
        Events.registeredEvents = Events.registeredEvents || {};
        return Events.registeredEvents.hasOwnProperty(thisEvent);
    }
    static reset() {
        Events.registeredEvents = {};
    }
}
