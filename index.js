import { EventEmitter, getOS } from './util'

let hcOrigin = '';
const gitcodeOriginSuffix = window.location.origin.match(/(?:\w+\.)*?gitcode((?:\.\w+)+)$/);
const atomgitOriginSuffix = window.location.origin.match(/(?:\w+\.)*?atomgit((?:\.\w+)+)$/);
if (gitcodeOriginSuffix) {
    const suffix = gitcodeOriginSuffix[1];
    hcOrigin = `https://idea.gitcode${suffix}`; // Adapter for gitcode multiple domains
} else if (atomgitOriginSuffix) {
    const suffix = atomgitOriginSuffix[1];
    hcOrigin = `https://idea.atomgit${suffix}`; // Adapter for atomgit multiple domains
} else {
    hcOrigin = 'https://idea.gitcode.com'; // Adapter for cangjie playground
}
const iframe = document.createElement('iframe');
iframe.id = 'codeartside';
iframe.src = hcOrigin + '/codearts-core-web-static/1.0.102/resources/server/gitcode.html';

const OS = getOS();
const ON_DID_CHANGE = 'onDidChange';
const ON_DID_SEND_CODE = 'onDidSendCode';
const ON_DID_CLICK_LINK = 'onDidClickLink';
const ON_DID_CLICK_LINE_NUMBER = 'onDidClickLineNumber';

// Used to get the location hash, different from the standard W3C fragment text flag '#:~:text=',
// which will be handled by the browser and removed then. We cannot get the location hash if use '#:~:text='.
export const CUSTOM_W3C_FRAGMENT_TEXT_FLAG = '#:~text=';

const eventEmitter = new EventEmitter();

function ideLoading() {
    return new Promise((resolve) => {
        function handleMessage(event) {
            if (event.origin !== hcOrigin) {
                return;
            }
            if (event.data === 'ide-loaded') {
                // Post location message to ide.
                postMessage({
                    type: 'documentLink',
                    data: `${window.location.origin}${window.location.pathname}`
                });

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
    if (type === 'ide-on-did-send-code') {
        eventEmitter.emit(ON_DID_SEND_CODE, data);
    }
    if (type === 'ide-on-did-click-link') {
        eventEmitter.emit(ON_DID_CLICK_LINK, data);
    }
    if (type === 'ide-on-did-click-line-number') {
        eventEmitter.emit(ON_DID_CLICK_LINE_NUMBER, data);
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

// file: { content: string, path: string, name: string, customW3cFragmentTextHash?: string }
export function openFile(file) {
    const message = {
        type: 'openFile',
        data: { ...file, customW3cFragmentTextHash: window.location.hash.startsWith(CUSTOM_W3C_FRAGMENT_TEXT_FLAG) ? window.location.hash : undefined }
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

export function setEditorFontSize(fontSize) {
    const message = {
        type: 'setEditorFontSize',
        data: fontSize
    };
    postMessage(message);
}

export function registerCodeOperation(options) {
    const message = {
        type: 'registerCodeOperation',
        data: options
    };
    postMessage(message);
}

export function blockClickedLink(block) {
    const message = {
        type: 'blockClickedLink',
        data: block
    };
    postMessage(message);
}

export function setHighlightLineNumber(config) {
    const message = {
        type: 'setHighlightLineNumber',
        data: config
    };
    postMessage(message);
}

export function enableMarkdownPreview(isEnable) {
    const message = {
        type: 'enableMarkdownPreview',
        data: isEnable
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

let isRegisteredSendCodeListener = false;
export function onDidSendCode(listener) {
    if (!isRegisteredSendCodeListener) {
        window.addEventListener('message', onDidRecieveMessage);
        isRegisteredSendCodeListener = true;
    }
    eventEmitter.on(ON_DID_SEND_CODE, listener);
    return {
        dispose: () => {
            eventEmitter.off(ON_DID_SEND_CODE, listener);
            window.removeEventListener('message', onDidRecieveMessage);
            isRegisteredSendCodeListener = false;
        }
    }
}

let isRegisteredClickLinkListener = false;
export function onDidClickLink(listener) {
    if (!isRegisteredClickLinkListener) {
        window.addEventListener('message', onDidRecieveMessage);
        isRegisteredClickLinkListener = true;
    }
    eventEmitter.on(ON_DID_CLICK_LINK, listener);
    return {
        dispose: () => {
            eventEmitter.off(ON_DID_CLICK_LINK, listener);
            window.removeEventListener('message', onDidRecieveMessage);
            isRegisteredClickLinkListener = false;
        }
    }
}

let isRegisteredClickLineNumberListener = false;
export function onDidClickLineNumber(listener) {
    if (!isRegisteredClickLineNumberListener) {
        window.addEventListener('message', onDidRecieveMessage);
        isRegisteredClickLineNumberListener = true;
    }
    eventEmitter.on(ON_DID_CLICK_LINE_NUMBER, listener);
    return {
        dispose: () => {
            eventEmitter.off(ON_DID_CLICK_LINE_NUMBER, listener);
            window.removeEventListener('message', onDidRecieveMessage);
            isRegisteredClickLineNumberListener = false;
        }
    }
}
