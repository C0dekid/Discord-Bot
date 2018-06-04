const mysql = require("mysql");
const config = require("../../conf");
const Pushbullet = require("./Pushbullet");

const db = mysql.createConnection(config.mysql);
let discord = null;
let keepAliveTimer = null;
let reconnTries = 0;

class Database {
    constructor() {
        this.connected = false;
    }
    setDiscord(d)
    {
        discord = d;
    }

    startConnection() {
        const self = this;
        return new Promise((resolve, reject) => {
            db.connect((error) => {
                if(error)
                {
                    reject(error.errno);

                }else{
                    db.on("error", function(error) {
                        Log.e("MySQL", "Connection has been dropped! Error: " + error);
                        if(config.Pushbullet.enable === true)
                        {
                            Pushbullet.push('Discord Bot [MySQL]', "The MySQL Server went offline! " + error).then(msg => {});
                        }

                        db.destroy();
                        discord.destroy();

                        // Not connected anymore
                        self.connected = false;
                    });

                    self.connected = true;
                    resolve('connected');
                }
            });
        });
    }

    keepAlive()
    {
        if(this.connected === true)
        {
            keepAliveTimer = setInterval(() => {
                db.query("SELECT NOW();", (err, rows, fields) => {
                    if(err) {
                        // Log.e("MySQL", err);
                    }
                });
            }, 30000);
        }
    }

    useDB() {

        return db;
    }

    connectState()
    {
        return new Promise((resolve, reject) => {

            resolve(this.connected);

        });
    }
}

module.exports = new Database(config.mysql);