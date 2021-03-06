import { getAppEnv } from '../config/env';

const env = getAppEnv();
const { NODE_ENV, PUBLIC_URL = '' } = env.raw;

let assetManifest;
if (NODE_ENV === 'production') {
    assetManifest = require('../build/asset-manifest.json');
} else {
    assetManifest = {
        'center.js': '/center.bundle.js',
        'guest.js': '/guest.bundle.js'
    };
}

const preloadScripts = (bundles, basename) => {
    const mainJS = assetManifest[`${basename}.js`];
    const bundleFilePaths = bundles
        .filter(bundle => bundle.file.match(/\.js$/))
        .map(jsBundle => `${PUBLIC_URL}/${jsBundle.file}`);
    console.log('============================');

    console.log({ bundleFilePaths });

    return [...bundleFilePaths, mainJS]
        .map(jsFilePath => `<link rel="preload" as="script" href="${jsFilePath}"></script>`)
        .join('');
};

const cssLinks = () => {
    if (NODE_ENV !== 'production') {
        return '';
    }

    return Object.keys(assetManifest)
        .filter(file => file.match(/\.css$/))
        .map(cssFile => assetManifest[cssFile])
        .map(cssFilePath => `<link rel="stylesheet" href="${cssFilePath}">`)
        .join('');
};

const jsScripts = (bundles, basename) => {
    const mainJS = assetManifest[`${basename}.js`];
    const bundleFilePaths = bundles
        .filter(bundle => bundle.file.match(/\.js$/))
        .map(jsBundle => `${PUBLIC_URL}/${jsBundle.file}`);

    return [...bundleFilePaths, mainJS]
        .map(jsFilePath => `<script type="text/javascript" src="${jsFilePath}"></script>`)
        .join('');
};

export const indexHtml = ({ helmet, initialState, markup, bundles, basename }) => {
    const htmlAttrs = helmet.htmlAttributes.toString();
    const bodyAttrs = helmet.bodyAttributes.toString();

    return `
    <!doctype html>
    <html lang="en" ${htmlAttrs}>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${preloadScripts(bundles, basename)}
        ${helmet.link.toString()}
        ${cssLinks()}
        ${helmet.style.toString()}
        ${helmet.script.toString()}
        ${helmet.noscript.toString()}
      </head>
      <body ${bodyAttrs}>
        <div id="root">${markup}</div>

        <script>
          window.process = ${env.forIndexHtml};
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
          window.assetManifest = ${JSON.stringify(assetManifest)}
        </script>

        ${jsScripts(bundles, basename)}
      </body>
    </html>
  `;
};
