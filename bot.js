const config = require('./conf');
const DiscordJS = require('discord.js');
const Clyde = require('./Clyde');
const Database = require("./bot/libs/mysql");
global.Log = require("./console.log");

try {
    const DiscordClient = new DiscordJS.Client();
    const Bot = config.bots.clyde;
    const isConnected = false;

    Log.i("DiscordLogin", `Hello, i'm ${Bot.nickname}! I'm now checking for the database connection, please hold on.`);

    Database.setDiscord(DiscordClient);
    const abc = Database.startConnection().then(state => {
        
        if(state === "connected")
        {
            Log.i("DiscordLogin", "Awesome! The database is connected, now I can sign in to Discord.");
            DiscordClient.login(Bot.discord.ClientToken).then(c => {
                Database.keepAlive();
                Clyde(DiscordClient);
            });
        }else{

            setInterval(abc, 10000);
        }
    })
    .catch(a => {
        // Unhandled rejections
        Log.e("MySQL", "Cannot connect to the MySQL Server.. It seems to be offline!");
    });

} catch (error)
{
    // Unhandled exception error
}