export class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => {
                listener(...args);
            });
        }
    }

    off(event, listener) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener);
        }
    }

    clear() {
        this.events = {};
    }
}

export function getOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('windows') !== -1) {
        return 'win';
    } else if (userAgent.indexOf('mac') !== -1) {
        return 'darwin';
    } else if (userAgent.indexOf('linux') !== -1) {
        return 'linux';
    } else {
        return 'unknown';
    }
}