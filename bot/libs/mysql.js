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
        reconnTries++;
        return new Promise((resolve, reject) => {
            db.connect((error) => {
                if(error)
                {
                    reject(error.errno);

                }else{
    
                    Log.i("MySQL", "Connected to MySQL Database!");
                    this.connected = true;
                    this.keepAlive();
    
                    db.on("error", (error) => {
                        Log.e("MySQL", "Connection has been dropped!");
                        if(config.Pushbullet.enable === true)
                        {
                            Pushbullet.push('Discord Bot [MySQL]', "The MySQL Server went offline! " + error).then(msg => {});
                        }
    
                        discord.destroy();
                        db.destroy();

                        keepAliveTimer = setInterval(this.startConnection(), 10000);
                        if(reconnTries >= 3)
                        {
                            clearInterval(keepAliveTimer);
                            keepAliveTimer = null;

                            Log.e("MySQL", "Failed to reconnect!");
                        }
                    });

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