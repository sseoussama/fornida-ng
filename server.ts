// https://medium.com/@cyrilletuzi/angular-server-side-rendering-in-node-with-express-universal-engine-dce21933ddce
// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
const bodyParser = require('body-parser');
const colors = require('colors');

colors.setTheme({
  err: ['bgRed', 'white'],
  greenWhite: ['bgGreen', 'white']
});

// needed because ng is using firebase auth https://stackoverflow.com/questions/41214625/firebase-node-js-error-the-xmlhttprequest-compatibility-library-was-not-foun
global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;


// solve for window https://blog.khophi.co/localstorage-undefined-angular-server-side-rendering/
const MockBrowser = require('mock-browser').mocks.MockBrowser;
const mock = new MockBrowser();
global['document'] = mock.getDocument();
global['window'] = mock.getWindow();


// localStorage patch
import 'localstorage-polyfill';
global['localStorage'] = localStorage;
global['UNIV'] = true;
 // let jsdom = require('jsdom').jsdom;
 // let document = jsdom('<html></html>', {});
 // let window = document.defaultView;
 // let $ = require('jquery')(window);



// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api',require('./api/api'));
app.use('/sms',require('./api/sms'));

// app.engine('html', ngExpressEngine({
//   bootstrap: AppServerModuleNgFactory,
//   providers: [
//     provideModuleMap(LAZY_MODULE_MAP)
//   ]
// }));

app.engine('html', (_, options, callback) => {
  const engine = ngExpressEngine({
      bootstrap: AppServerModuleNgFactory,
      providers: [
          { provide: 'request', useFactory: () => options.req, deps: [] },
          provideModuleMap(LAZY_MODULE_MAP)
      ]
  });
  engine(_, options, callback);
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

app.use(function (err, req, res, next) {
  const sending = {};
  sending['error'] = `${err}`;
  let str = sending['error'];
  if (str.includes('"title":"')) {
    str = str.split('"title":"')[1];
    str = str.split(`","type"`)[0];
    console.log(`${str}`, err);
    sending['formatted'] = str;
  }
  console.log(`${err}`, err);
  res.status(422).send(sending);
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
