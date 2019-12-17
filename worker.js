const subscriptions = {};
const nextToken = 0;

// SUBSCRIPTIONS

export function subscribe(type, callback) {
    if (!subscriptions.includes(type)) {
        subscriptions[type] = {};
    }
    const token = nextToken;
    subscriptions[type][token] = callback;
    nextToken++;
    return nextToken;
}

export function unsubscribe(type, token) {
    if (subscriptions[type]) {
        delete subscriptions[type][token];
    }
}



function notifySubscribers(type, payload) {
    if (subscriptions[type] !== undefined) {
        for (callback of Object.values(subscriptions[type])) {
            callback(type, payload);
        }
    }
}

export function dispatch(type, payload) {
    setTimeout(() => {
        global.postMessage({ type, payload });
    }, 0)
}

// RECEIVING MESSAGES

global.onmessage = function (event) {
    const type = event.data.type;
    const payload = event.data.payload;

    notifySubscribers(type, payload);
}