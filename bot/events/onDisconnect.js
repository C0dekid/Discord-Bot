let discord = null;
const config = require('../../conf');
const Pushbullet = require('../libs/Pushbullet');

module.exports = {
    enabled: true,
    requireDiscord: true,
    setClient: (client) => {
        discord = client;
    },
    run: () => {
        try {
            if(config.Pushbullet.enable === true)
            {
                discord.on("disconnect", (error) => {
                    if(error)
                    {
                        error = error;
                    }else{
                        error = "unknown";
                    }
                    Pushbullet.push('Discord Bot', "The Discord Bot has been disconnected! Error given: " + error).then(body => {
                        if(body.error !== undefined) {
                            Log.e(`Pushbullet (${body.error.code})`, body.error.message);
                        }else{
    
                            Log.i("Pushbullet", "Sent a new note to the owner.");
                        }
                    });
                });
            }
        } catch (err)
        {
            // Unhandled exception errors
        }
    }
};