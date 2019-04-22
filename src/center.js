if (browserSupportsAllFeatures()) {
    require('./center/main');
} else {
    loadScript(window.assetManifest['polyfills.js'], () => require('./center/main'));
}

function browserSupportsAllFeatures() {
    return window.Promise && Object.assign;
}

function loadScript(src, done) {
    const script = document.createElement('script');

    script.src = src;
    script.onload = () => {
        done();
    };
    script.onerror = () => {
        done(new Error('Failed to load script ' + src));
    };

    document.head.appendChild(script);
}
