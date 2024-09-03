import { EventEmitter } from './util'

const hcOrigin = 'https://codeartside.obs.cn-north-4.myhuaweicloud.com';
const iframe = document.createElement('iframe');
iframe.id = 'codeartside';
iframe.src = hcOrigin + '/web-static/1.0.28/resources/server/gitcode.html';

const ON_DID_CHANGE = 'onDidChange';
const eventEmitter = new EventEmitter();

function ideLoading() {
    return new Promise((resolve) => {
        function handleMessage(event) {
            console.log('-gitcode--receive message---', event.data);
            if (event.origin !== hcOrigin) {
                return;
            }
            if (event.data === 'ide-loaded') {
                resolve();
                window.removeEventListener('message', handleMessage);
            }
        }
        window.addEventListener('message', handleMessage);
    });
}

function ideContent() {
    return new Promise((resolve) => {
        function handleMessage(event) {
            const { type, data } = event.data;
            console.log('-gitcode--receive message---', event.data);
            if (event.origin !== hcOrigin) {
                return;
            }
            if (type === 'ide-content') {
                resolve(data);
                window.removeEventListener('message', handleMessage);
            }
        }
        window.addEventListener('message', handleMessage);
    });
}

function onDidRecieveMessage(event) {
    const { type, data } = event.data;
    if (event.origin !== hcOrigin) {
        return;
    }
    if (type === 'ide-on-did-change-file') {
        eventEmitter.emit(ON_DID_CHANGE, data);
    }
}

export function preload() {
    iframe.width = '1px';
    iframe.height = '1px';
    iframe.style.opacity = 0;
    iframe.style.zIndex = -1;
    document.body.appendChild(iframe);
    return ideLoading();
}

// style: { width: string, height: string }
export function show(id, style) {
    var targetNode = document.getElementById(id);
    targetNode.appendChild(iframe);
    const { width, height } = style;
    iframe.width = width;
    iframe.height = height;
    iframe.style.opacity = 1;
    iframe.style.zIndex = 1;
    return ideLoading();
}

// file: { content: string, path: string, name: string }
export function openFile(file) {
    const message = {
        type: 'openFile',
        data: file
    };
    postMessage(message);
}

export function dispose() {
    window.removeEventListener('message', onDidRecieveMessage);
    eventEmitter.clear();
    iframe.remove();
}

export function setPreview(preview) {
    const message = {
        type: 'setPreview',
        data: preview
    };
    postMessage(message);
}

export function getContent() {
    const message = {
        type: 'getContent'
    };
    postMessage(message);
    return ideContent();
}

export function setUserId(domainId, userId) {
    const message = {
        type: 'setUserId',
        data: { domainId, userId }
    };
    postMessage(message);
}

export function setImgPrefix(prefix) {
    const message = {
        type: 'setImgPrefix',
        data: prefix
    };
    postMessage(message);
}

export function setFilePrefix(prefix) {
    const message = {
        type: 'setFilePrefix',
        data: prefix
    };
    postMessage(message);
}

function postMessage(message) {
    iframe.contentWindow.postMessage(message, hcOrigin);
}

let isRegisteredListener = false;
export function onDidChange(listener) {
    if (!isRegisteredListener) {
        window.addEventListener('message', onDidRecieveMessage);
        isRegisteredListener = true;
    }
    eventEmitter.on(ON_DID_CHANGE, listener);
    return {
        dispose: () => {
            eventEmitter.off(ON_DID_CHANGE, listener);
        }
    }
}
