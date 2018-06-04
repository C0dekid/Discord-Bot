let discord = null;
const config = require('../../conf');

module.exports = {
    enabled: true,
    requireDiscord: true,
    setClient: (client) => {
        discord = client;
    },
    run: () => {
        const botnick = config.bots.clyde.nickname;
        discord.on("guildCreate", guild => {
            Log.d('guildCreate', 'Guild joined: ' + guild.name);
            guild.members.get(discord.user.id).setNickname(botnick).then(nick => {

                Log.d("setNickname", `Nickname on recently joined guild '${guild.name}' has been set!`);

            })
            .catch((error) => {

                Log.e("setNickname", `Changing nickname on ${guild.name} is not allowed. Error: ${error}`);
            });
        });

        discord.on("guildDelete", guild => {

            Log.w("Kicked", `${botnick} left or has been kicked out of the server ${guild.name}.`);
        });
    }
};