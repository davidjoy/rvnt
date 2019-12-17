const workers = {};
const subscriptions = {};
const nextToken = 0;

// RECEIVING MESSAGES

function handleMessage(event) {
    const type = event.data.type;
    const payload = event.data.payload;

    notifySubscribers(type, payload);
}

function notifySubscribers(type, payload) {
    if (subscriptions[type] !== undefined) {
        for (callback of Object.values(subscriptions[type])) {
            callback(type, payload);
        }
    }
}

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

// DISPATCHING MESSAGES

export function dispatch(type, payload, { workerIds }) {
    setTimeout(() => {
        const ids = workerIds === undefined ? Object.keys(workers) : workerIds;
        for (workerId of ids) {
            workers[workerId].postMessage({ type, payload });
        }
    }, 0);
}

export function createWorker(id, script) {
    const worker = new Worker(script);
    worker.onmessage = handleMessage;
    workers[id] = worker;

    return () => {
        worker.terminate();
    }
}