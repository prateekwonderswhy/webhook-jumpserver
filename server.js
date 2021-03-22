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
app.use(function(req,res,next){
    if(req.get('content-type')!=="application/json")
    {
        res.status(422)
        res.json({success:false,message:"Only JSON is allowed"});
    }
    else next()
})
app.use(bodyParser.json({extended:false,limit:'5mb'}),function(error,req,res,next){
        if (error instanceof SyntaxError)
       { 
            console.error("Error in parsing json");
            res.status(422).json({success:false,message:'corrupt json'})
        }
        next()
})

app.use(router)
app.use(function(req,res){res.sendStatus(404);})
// httpServer.listen(8080, (p, h) => console.log(`HTTP  Server listening `));
httpsServer.listen(8443,'0.0.0.0', (p, h) => console.log(`HTTPS Server listening at 0.0.0.0:8443`));
