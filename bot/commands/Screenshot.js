const config = require("../../conf");
const { hex2decimal } = require("../../helpers/Colors");
module.exports = {
    enabled: true,
    userLevel: 0,
    commando: "screenshot",
    description: "Takes a screenshot from a website!",
    arguments: {
        argumentList: [
            {
                optional: false,
                name: "url",
                mustBe: "a IP address or url",
                notAllowed: [],
                regex: /^([a-zA-Z0-9.:/-_=&])+$/g
            }
        ]
    },
    runCommand: (messageObj) => {
        const message = messageObj.message;
        const channel = messageObj.channel;
        const author = messageObj.author;
        const args = messageObj.parts;

        const nickname = message.guild.members.get(author.id).nickname || author.username;
        const C99 = require("../libs/C99");

        channel.send("Taking a screenshot.. Please wait! :camera: ").then(msg => {
            C99.Screenshot(args[0]).then(result => {
                if(result.error) {
    
                    msg.edit(result.error);
    
                }else{
                    const embed = {
                        color: hex2decimal('#7289DA'),
                        author: {
                            name: `${config.bots.clyde.nickname}`,
                            icon_url: "https://evaljs.eu/Clyde3.png"
                        },
                        title: "Your requested screenshot is ready.",
                        description: "**Disclaimer:** Screenshots taken by the C99.nl API. Screenshots may contain NSFW content, that's why I refuse to send the result in a public channel or guild. This Discord Bot doesn't store any information about you and your screenshot you took."
                    };
                    author.send({embed: embed, files: [result.url]}).catch((err) => {
                        console.log(err);
                    });
                    msg.edit(`The screenshot is ready thanks to C99.nl! Due some legal issues and privacy, I've sent you the results in a direct message. If you haven't receive anything, please make sure you're accepting DM's from server members.`);
                }
            })
            .catch((err) => {
                // unhandled rejection
                Log.e("c99 API", err);
            });
        })
        .catch((err) => {});
    }
};