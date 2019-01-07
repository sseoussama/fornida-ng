const express = require("express");
const colors = require("colors");
const bodyParser = require("body-parser");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const engines = require('consolidate');

colors.setTheme({
  err: ["bgRed", "white"],
  greenWhite: ["bgGreen", "white"]
});

// init "app"
const app = express();
var staticRoot = __dirname + "/dist/";
app.set("port", process.env.PORT || 8080);

app.use(
  cors({
    origin: [
      "http://127.0.0.1:4200",
      "http://localhost:4200",
      "http://localhost:4000",
      "http://localhost:8080",
      "http://192.168.1.9:4200",
      "http://192.168.1.9",
      "192.168.1.9",
      "http://localhost:8070",
      "https://store-fcknjlyuc.mybigcommerce.com",
      "https://fornida.herokuapp.com"
    ]
  })
);

//parse incoming data before routes
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// const DIST_FOLDER = path.join(__dirname + '../../fornida_server/dist/');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
// app.get('*.*', express.static(path.join(DIST_FOLDER)));
// app.use(express.static(__dirname + '../../fornida_server/dist'));
// api routes
// app.use('/api',require('./api'));
app.use("/api", require("../api/api"));
app.use('/sms', require('../api/sms'));

// app.use(function(req, res, next) {
//   var requester_url = req.protocol + "://" + req.get("host") + req.originalUrl;
//   var isDev =
//     requester_url.includes("nodetest") || requester_url.includes("localhost");
//   // console.log(`DEV: ${isDev}`.magenta)
//   if (!req.secure && !isDev && req.get("X-Forwarded-Proto") !== "https") {
//     res.redirect("https://" + req.get("Host") + req.url);
//   }
//   //if the request is not html then move along
//   var accept = req.accepts("html", "json", "xml");
//   if (accept !== "html") {
//     return next();
//   }
//   // if the request has a '.' assume that it's for a file, move along
//   var ext = path.extname(req.path);
//   if (ext !== "") {
//     return next();
//   }
//   fs.createReadStream(staticRoot + "index.html").pipe(res);
// });

// error middleware
// app.use(function(err, req, res, next){
//     console.log(`${err}`.err);
//     console.log(err);
//     const ee = JSON.stringify(ery);
//     // console.log('==>')
//     // console.log(JSON.parse(err));
//     // console.log('<==')
//     // res.send({err:`${err}`});
//     res.status(422).send(JSON.parse(err.toLowerCase()))
// });

app.use(function(err, req, res, next) {
  console.error("ERR ==>",err);
  let sending = {};
  sending.error = `${err}`;
  let str = sending.error;
  if (str.includes('"title":"')) {
    str = str.split('"title":"')[1];
    str = str.split(`","type"`)[0];
    console.log(`${str}`.err);
    sending.formatted = str;
  }
  console.log(`${err}`.err);
  res.status(422).send(sending);
});

// app.use(express.static(staticRoot));

app.listen(app.get("port"), function() {
  console.log("app running on port", app.get("port"));
});
