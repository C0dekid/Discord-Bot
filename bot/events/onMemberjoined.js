let discord = null;
const config = require('../../conf');
const Pushbullet = require('../libs/Pushbullet');

module.exports = {
    enabled: false,
    requireDiscord: true,
    setClient: (client) => {
        discord = client;
    },
    run: () => {

        if(config.bots.clyde.sayHiToNewMembers === true)
        {
            discord.on("guildMemberAdd", member => {
                const channel = member.guild.channels.find('name', 'general');
                if(!channel) return;
    
                channel.send(`Hello ${member}, welcome to ${member.guild.name}! My name is ${config.bots.clyde.nickname}.\r\nI'm a functional bot with some commands to use.\r\nIf you want my attention, use \`${config.bots.clyde.prefix}help\` to see what I can do for you.\r\n\r\nIf you have any questions, you can ask in #support if present or mention one of the staff members.\r\n\r\nEnjoy your stay! 🙂`).then(msg => {
                    
                    // msg.delete(60000);
                });
            });
        }
    }
};