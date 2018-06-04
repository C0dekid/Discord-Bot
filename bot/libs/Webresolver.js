const request = require("request");
const config = require("../../conf");

class Webresolver {
    req(endpoint, method, body) {
        const key = config.apis.webresolver.key;
        const str = body || "echo123";
        let options = {
            url: `https://webresolver.nl/api.php?key=${key}&action=${endpoint}&string=${str}&json`,
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

    GeoIP(ip) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.req("geoip", "GET", ip).then(body => {
                
                resolve(body);
            })
            .catch((err) => {
                // Unhandled rejection
            });
        });
    }

    Screenshot(url)
    {
        const self = this;
        return new Promise((resolve, reject) => {
            self.req("screenshot", "GET", url).then(body => {
                resolve(body);
            })
            .catch((err) => {
                // unhandled rejection.
            });
        });
    }
}

module.exports = new Webresolver();