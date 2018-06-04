const config = require("../../conf");
const Skidgame = require("../games/skid");
module.exports = {
    enabled: false,
    userLevel: 15,
    commando: "noskid",
    description: "Add or remove skidcounts from a user.",
    arguments: {
        argumentList: [
            {
                optional: false,
                name: "member",
                mustBe: "a mentioned user or memberid",
                notAllowed: [],
                regex: /^([<>0-9@!])+$/g
            },
            {
                optional: false,
                name: "amount",
                mustBe: "a number only.",
                notAllowed: [],
                regex: /^([0-9])+$/g
            },
            {
                optional: false,
                name: "type",
                mustBe: "a operator only.",
                notAllowed: [],
                regex: /^([-+])+$/g
            }
        ]
    },
    runCommand: (messageObj) => {
        
        const guild = messageObj.guild;
        const channel = messageObj.channel;
        const args = messageObj.parts;
        
        const memberid = args[0].replace("<", "").replace(">", "").replace("@", "").replace("!", "");

        if(memberid !== config.bots.clyde.discord.ClientID)
        {
            const member = guild.members.get(memberid);
            if(member) {
                Skidgame.adminPoints(memberid, args[1], args[2]).then(points => {
                    channel.send("Skid counter from this user has been changed.");
                })
                .catch((err) => {
                    // Unhandled rejection
                });

            }else{

                channel.send("This member does not exist, cannot be edited (server owner) or is not with us in the server.").then(msg => msg.delete(10000));
            }
        }
    }
};