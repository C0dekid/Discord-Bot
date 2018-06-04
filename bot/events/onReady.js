let discord = null;
const config = require('../../conf');
const Pushbullet = require('../libs/Pushbullet');

module.exports = {
    enabled: true,
    requireDiscord: true,
    setClient: (client) => {
        discord = client;
    },
    run: async () => {
        const Clyde = config.bots.clyde;
        Log.i("Discord", `Logged in with username ${discord.user.tag}!`);

        try {
            discord.user.setPresence({
                game: { name: Clyde.presence.playing },
                status: Clyde.presence.status
            });

            try {
                if(config.Pushbullet.enable === true)
                {
                    Pushbullet.push('Discord Bot', "The Discord Bot is running and ready!").then(body => {
                        if(body.error !== undefined) {
                            Log.e(`Pushbullet (${body.error.code})`, body.error.message);
                        }else{

                            Log.i("Pushbullet", "Sent a new note to the owner.");
                        }
                    });
                }

                const botnick = config.bots.clyde.nickname;
                discord.guilds.forEach(guild => {
                    guild.members.get(discord.user.id).setNickname(botnick).then(nick => {

                        Log.d("setNickname", `Online in Guild ${guild.name} with ${guild.memberCount} members located in ${guild.region}.`);

                    })
                    .catch((error) => {
                        Log.e("setNickname", `Changing nickname on ${guild.name} is not allowed.`);
                    });
                });
            } catch (err)
            {
                // Unhandled exception errors
            }

        } catch (err) { /* Unhandled exception errors */ }
    }
};