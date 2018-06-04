const config = require("../../conf");
module.exports = {
    enabled: true,
    userLevel: 5,
    commando: "nick",
    description: "Edit the nickname from the user.",
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
                name: "nickname",
                mustBe: "a nickname with letters and/or numbers only.",
                notAllowed: [],
                regex: /^([a-zA-Z0-9])+$/g
            }
        ]
    },
    runCommand: (messageObj) => {
        
        const guild = messageObj.guild;
        const channel = messageObj.channel;
        const args = messageObj.parts;
        
        const memberid = args[0].replace("<", "").replace(">", "").replace("@", "").replace("!", "");
        let splitted = args.splice(0, 1);
        const nick = args.join(" ");

        if(memberid !== config.bots.clyde.discord.ClientID)
        {
            const member = guild.members.get(memberid);
            if(member) {
                member.setNickname(nick).then(member => {
                
                    channel.send(`<@${memberid}> your new nickname in ${guild.name} is now ${nick}.`).then(msg => msg.delete(10000));
    
                })
                .catch((err) => {
                    Log.e("setNickname", "Cannot edit nicknames due privilege issues.");
                    channel.send("I don't have the rights to edit nicknames on this server!").then(msg => msg.delete(10000));
                });
            }else{

                channel.send("This member does not exist, cannot be edited (server owner) or is not with us in the server.").then(msg => msg.delete(10000));
            }
        }else{

            channel.send("I don't like my new nickname. I prefer to keep my current one :)").then(msg => msg.delete(10000));
        }
    }
};