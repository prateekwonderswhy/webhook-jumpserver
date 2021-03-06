const { default: axios } = require('axios');
const {Router}=require('express');
const app=Router()
const {GithubAuthenticator}=require("./authenticators")
if (! process.env.GITHUB_WEBHOOK_SECRET){
    throw "need secret:GITHUB_WEBHOOK_SECRET"
}
const authetincateGithub=GithubAuthenticator('X-Hub-Signature-256' , process.env.GITHUB_WEBHOOK_SECRET);
async function memer(req,res,next)
{
        res.status(401);
        res.setHeader('content-type',"text/html")
        res.end("<head><title>not allowed!</title></head><center><img src='https://sayingimages.com/wp-content/uploads/im-sorry-who-are-you-meme.png' /></center>")
}
async function handler(req, res,next)  {
    if (authetincateGithub(req)){
        console.log("This request is indeed from github");
        const options = {
            method: 'POST',
            headers: {...req.headers,host:'10.8.0.1:8080'},
            data: JSON.stringify(req.body),
            url:"http://10.8.0.1:8080/github-webhook/",
            responseType:'stream',
            timeout:10000
          }
          try{
        var response=await axios(options);
          }catch(e){
              console.log("error during connecting to jenkins, maybe timeout. is it reachable?");
              return res.status(505);
          }
          response.data.pipe(res);
          console.log("responded to github")
    }      
    else {
        console.log("Not from github")
        return memer(req,res,next)
         }
}
app.get("*",memer );
app.post("/jenkins-github-webhook",handler);
module.exports={router:app}
