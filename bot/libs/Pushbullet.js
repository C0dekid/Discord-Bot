const config = require('../../conf');
const request = require("request");
class Pushbullet
{
    constructor(key)
    {
        this.key = key;
        this.pbuser = null;
    }

    req(endpoint, method, body) {
        let options = {
            url: `https://api.pushbullet.com/v2/${endpoint}`,
            method: method,
            headers: {
                'Access-Token': this.key,
                'Content-Type': 'application/json'
            }
        };

        if(body)
        {
            options.body = JSON.stringify(body);
        }

        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                
                if(err || res.statusCode === 500)
                {
                    reject('Request failed');
                }else{

                    resolve(JSON.parse(body));
                }
            });
        });
    }

    async getUser() {
        const self = this;
        const user = await this.req('users/me', 'GET').then(body => { return body; });

        self.pbuser = user;

        return user;
    }

    async push(title, content)
    {
        const self = this;
        await this.getUser();
        return new Promise((resolve, reject) => {
            
            self.req('pushes', "POST", {
                "email": self.pbuser.email,
                "type": "note",
                "body": content,
                "title": title,
                "sender_name": config.bots.clyde.nickname

            }).then(body => {

                resolve(body);

            });
        });
    }
}


module.exports = new Pushbullet(config.Pushbullet.key);