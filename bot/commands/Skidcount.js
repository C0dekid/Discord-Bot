module.exports = {
    enabled: true,
    userLevel: 0,
    commando: "skidcount",
    description: "See how many times you said skid.",
    arguments: {
        argumentList: []
    },
    runCommand: (messageObj) => {
        const channel = messageObj.channel;
        const message = messageObj.message;
        const client = messageObj.discord;
        const author = messageObj.author;
        const args = messageObj.parts;

        const Skidgame = require("../../bot/games/skid");
        Skidgame.checkPoints(author.id).then(points => {

            channel.send(Skidgame.randomMessage(points, author.id));

        })
        .catch(err => {
            // Unhandled rejection
            message.reply("You never said skid in this server.");
        });
    }
};