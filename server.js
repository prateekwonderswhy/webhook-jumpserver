var fs = require("fs");
// var http = require("http");
var https = require("https");
var express = require("express");
var bodyParser = require('body-parser')
var {router}=require('./routes')

var privateKey=fs.readFileSync("key.pem")
var certificate=fs.readFileSync("cert.pem")
var credentials = { key: privateKey, cert: certificate, passphrase: process.env.CRED_PASSPHRASE };
var app = express();
// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.use(bodyParser.json({extended:true}))
app.use(router)
app.use(function(req,res){res.sendStatus(404);})
// httpServer.listen(8080, (p, h) => console.log(`HTTP  Server listening `));
httpsServer.listen(8443,'0.0.0.0', (p, h) => console.log(`HTTPS Server listening at 0.0.0.0:8443`));
