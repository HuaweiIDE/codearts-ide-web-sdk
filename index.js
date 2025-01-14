import { EventEmitter, getOS } from './util'

let hcOrigin = '';
if (window.location.origin.endsWith('.net')) {
    hcOrigin = 'https://idea.gitcode.net';
} else {
    hcOrigin = 'https://idea.gitcode.com';
}
const iframe = document.createElement('iframe');
iframe.id = 'codeartside';
iframe.src = hcOrigin + '/codearts-core-web-static/1.0.74/resources/server/gitcode.html';

const OS = getOS();
const ON_DID_CHANGE = 'onDidChange';
const ON_DID_CLICK_MD_LINK = 'onDidClickMdLink';
const eventEmitter = new EventEmitter();

function ideLoading() {
    return new Promise((resolve) => {
        function handleMessage(event) {
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
    if(type === 'ide-on-did-click-md-link') {
        eventEmitter.emit(ON_DID_CLICK_MD_LINK, data);
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
    const { width, height } = style;
    iframe.width = width;
    iframe.height = height;
    iframe.style.opacity = 1;
    iframe.style.zIndex = 1;
    var targetNode = document.getElementById(id);
    targetNode.appendChild(iframe);
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
    const url = 'https://cloudide.cn-north-4.myhuaweicloud.com/v1/ca/behavior/codearts-record';
    const body = JSON.stringify({
        'scope': 'gitcode-repo',
        'action': 'setUserId',
        'data': null,
        'platform': 'websdk.3.0.0',
        'machine_code': 'codearts0machinecodearts0machinecodearts0machinecodearts0machine',
        'scenario': 'WEBSDK',
        'os': OS,
        'arch': 'webide',
        'domain_id': domainId,
        'user_id': userId,
        'identifier': 'ide'
    });
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Content-Length': body.length },
        body,
    });

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

export function setIframeOrigin(origin) {
    const message = {
        type: 'setIframeOrigin',
        data: origin
    };
    postMessage(message);
}

export function setColorTheme(theme) {
    const message = {
        type: 'setColorTheme',
        data: theme
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
            window.removeEventListener('message', onDidRecieveMessage);
            isRegisteredListener = false;
        }
    }
}
