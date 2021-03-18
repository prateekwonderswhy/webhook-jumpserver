function GithubAuthenticator(header/** 'X-Hub-Signature-256' */,secret,algo='sha256')
{
    const crypto=require('crypto');
    return function(request){

        //request.body is expected to be hold a value
        return crypto.createHmac(algo, secret)
        .update(JSON.stringify(request.body))
        .digest("hex")===request.get(header)?.split("=").pop()
    }
}

module.exports={GithubAuthenticator}