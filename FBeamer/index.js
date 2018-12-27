'use strict';

class FBeamer {
    constructor({ pageAcessToken, verifyToken, appSecret }) {
        try {
            if (pageAcessToken && verifyToken) {
                this.pageAcessToken = pageAcessToken
                this.verifyToken = verifyToken
                this.appSecret = appSecret
            } else {
                throw `one or more token/credential missing`;
            }
        } catch (error) {
            console.log(error);
        }

    }
    registerHook(req, resp) {
        const params = req.query;
        const mode = params['hub.mode'],
            token = params['hub.verify_token'],
            challenge = params['hub.challenge'];
        //if mode = 'subscribe' && verify token === our token then send back challenges
        try {
            if ((mode && token) && (mode === 'subscribe' && token === this.verifyToken)) {
                console.log('Webhook Registered....');
                resp.send(challenge);
            } else {
                console.log('Webhook Not Registered... ::(');
                resp.send(200);
            }

        } catch (error) {
            console.log(error);
        }
    }
    //buff=>present on rew request body which is return from facebook
    verifySignature(req, resp, buff) {
        return (req, resp, buff) => {
            if (req.method == 'POST') {
                let signature = req.headers['x-hub-signature']
                if (!signature) {
                    throw `signature not received`
                } else {
                    let hash = crypto.createHmac('sha1', this.appSecret).update(buf, 'utf-8');
                    if (hash.digest('hex') !== signature.split("=")[1]) {
                        throw "Invalid signature!";
                    }
                }
            }

        }
    }
}

module.exports = FBeamer;
