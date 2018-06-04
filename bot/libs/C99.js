const request = require("request");
const config = require("../../conf");

class C99 {
    req(endpoint, method, body) {
        const key = config.apis.c99.key;
        const str = body || "google.de";
        let options = {
            url: `https://api.c99.nl/${endpoint}.php?key=${key}&url=${str}&json`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        return new Promise((resolve, reject) => {
            request(options, (err, res, output) => {
                if(err || res.statusCode === 500) {
                    reject("http_request_failed");

                }else{
                    resolve(JSON.parse(output));
                }
            });
        });
    }

    Screenshot(url) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.req("createscreenshot", "GET", url).then(body => {
                
                resolve(body);
            })
            .catch((err) => {
                // Unhandled rejection
            });
        });
    }
}

module.exports = new C99();