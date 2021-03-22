function GithubAuthenticator(header/** 'X-Hub-Signature-256' */,secret,algo='sha256')
{
    const crypto=require('crypto');
    return function(request){

        // check if header value is not very large, 71 is the total length including the preceding "sha256=" text
        var shaHeader=request.get(header)
        if ((!shaHeader) ||shaHeader.length>71)return false
        else return crypto.createHmac(algo, secret)
            .update(JSON.stringify(request.body))
            .digest("hex")===shaHeader.slice(7)
    }
}

module.exports={GithubAuthenticator}
