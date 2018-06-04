module.exports = {
    enabled: true,
    userLevel: 5,
    commando: "avatar",
    description: "Set the avatar for the bot",
    arguments: {
        argumentList: [
            {
                optional: false,
                name: "url",
                mustBe: "an url",
                notAllowed: [],
                regex: /^([a-zA-Z0-9.:/])+$/g
            }
        ]
    },
    runCommand: (messageObj) => {
        const channel = messageObj.channel;
        const client = messageObj.discord;
        const args = messageObj.parts;

        client.user.setAvatar(args[0]).then(ava => {
            channel.send("I have a new avatar! Whoohoo!");
        })
        .catch((err) => {
            // unhandled rejection
        });
    }
};