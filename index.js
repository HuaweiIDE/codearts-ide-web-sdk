var iframe = document.createElement('iframe');
iframe.id = 'codeartside';
iframe.src = 'https://res.hc-cdn.com/codearts-core-web-static/1.0.9/resources/server/gitcode.html';
iframe.width = '1px';
iframe.height = '1px';
iframe.style.opacity = 0;
iframe.style.zIndex = -1;

export function preload(id) {
    return new Promise((resolve) => {
        var targetNode = document.getElementById(id);
        targetNode.appendChild(iframe);
        iframe.addEventListener('load', () => {
            resolve();
        });
    });
}

// style: { width: string, height: string }
export function show(style) {
    const {width, height} = style;
    iframe.width = width; 
    iframe.height = height; 
    iframe.style.opacity = 1;
    iframe.style.zIndex = 1;
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
    iframe.parentNode.removeChild(iframe);
}

function postMessage(message) {
    iframe.contentWindow.postMessage(message, '*');
}
