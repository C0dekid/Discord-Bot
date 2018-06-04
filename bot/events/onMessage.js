let discord = null;
const config = require('../../conf');
const mysql = require("../libs/mysql").useDB();
const glob = require('glob');
const { Test, isString, isMixed } = require("../../helpers/MessagesHelper");
const spam = require("../../helpers/Antispam");
const Skidgame = require("../../bot/games/skid");

module.exports = {
    enabled: true,
    requireDiscord: true,
    setClient: (client) => {
        
        discord = client;
    },
    run: () => {
        let spamcount = [];
        let spampenalty = [];

        let serverCommands = [];
        if(!process.env.PWD) {
            process.env.PWD = process.cwd();
        }

        glob(process.env.PWD + "/bot" + `${config.folders.commands}` + "/*.js", (err, files) => {
            console.log(`Scanning folder '${config.folders.commands}' for javascript files.`);

            if(err)
            {
                Log.e("onMessage", "File(s) or folder(s) cannot be opened, are removed do something else happend.");

            }else{

                if(files.length === 0)
                {
                    Log.w("Commands", "There are no commands available for this bot.");

                }else{

                    files.forEach(file => {
                        const plugin = require(file);
                        const depencency = file.split('/');
                        const pluginName = depencency[depencency.length-1].replace(".js", "");

                        if(plugin.enabled !== undefined && plugin.enabled === true) {
                            serverCommands[plugin.commando] = plugin;
                            Log.v(pluginName, "Commando File is loaded");
                        }else{

                            Log.w(pluginName, "This plugin has been disabled, it's not loaded!");
                        }

                        // Unload the file
                        const name = require.resolve(file);
                        delete require.cache[name];
                    });
                }
            }
        });

        let awaitAnswer = false;

        discord.on("message", message => {
            if(message.channel.type != "dm" && message.author.bot === false) {

                let commands = [];
                let permission = 0;

                const guild = message.guild;
                const guild_sid = guild.id;
                const channel = message.channel;
                const author = message.author;
                const timeout = 1000;

                if(typeof(spamcount[author.id]) === "undefined")
                {
                    spamcount[author.id] = 0;
                    spampenalty[author.id] = 0;
                }

                // SKID Game
                const Skidmessage = message.content.split(" ");
                const SkidRegex = new RegExp(/(skid)+/g);

                for(let i = 0; i < Skidmessage.length; i++) {
                    if(!message.content.startsWith(config.bots.clyde.prefix) && SkidRegex.test(Skidmessage[i].toLowerCase()))
                    {
                        if(spam(author.id, 10) === false)
                        {
                            Skidgame.setPoints(author.id);
                            Skidgame.checkPoints(author.id).then(points => {
                                let newCount = points+=1;
                                if(newCount % 3 == 0) {
                                    channel.send(Skidgame.randomMessage(points, author.id))
                                    .catch((err) => {});
                                }
 
                                spampenalty[author.id] = 0;
                            })
                            .catch(err => {
                                // Unhandled rejection
                            });

                            const emojis = message.guild.emojis;
                            emojis.forEach(emoji => {
                                if(emoji.name && emoji.name === "clyde")
                                {
                                    message.react(emoji.id);
                                }
                            });
                        }else{

                            spamcount[author.id]++;
                            if(spamcount[author.id] >= 1)
                            {
                                spampenalty[author.id]+=25;
                                channel.send(`Please do not spam the skid counter, doesn't matter how many times you say 'skid' in your sentence, it will only count as 1. It can result in a warning, mute or ban. Penalty score: ${spampenalty[author.id]}/100`).then(msg => {
                                    msg.delete(6000);
                                    spamcount[author.id] = 0;

                                    if(spampenalty[author.id] == 100)
                                    {

                                        channel.send(`.warn <@${author.id}> Please do not spam this server/channel. #Autowarn by ${config.bots.clyde.nickname}`).then(msg => msg.delete(0));

                                    }else if(spampenalty[author.id] > 100) {
                                        spampenalty[author.id] = 0;
                                        channel.send(`.mute <@${author.id}>`).then(msg => msg.delete(0))
                                        .catch((err) => {});
                                    }
                                })
                                .catch((err) => {});
                            }
                        }

                        break;
                    }
                }
                try {
                    mysql.query("SELECT permission_level, permission_uid FROM bot_user_permissions WHERE permission_uid = ?", [author.id], (err, rows, fields) => {
                        if(err)
                        {
                            Log.e("MySQL Error [onMessage.js]", err);

                        }else{
                            const developers = config.bots.clyde.developers;
                            if(message.content.startsWith(config.bots.clyde.prefix) && config.bots.clyde.maintenance === true && developers.indexOf(author.id) === -1)
                            {
                                channel.send(":no_entry_sign: Sorry, I cannot execute that command for you! I'm currently under maintenance. I will be back soon.").then(msg => {
                                    msg.delete(10000);
                                })
                                .catch((err) => {});

                            }else{
                                if(rows.length == 1)
                                {
                                    if(rows[0].permission_uid === author.id)
                                    {
                                        permission = parseInt(rows[0].permission_level);
                                    }
                                }
                                
                                const cmd = message.content;
                                const parts = cmd.split(" ");
                                const plugin = (isMixed(parts[0].toLowerCase().replace(config.bots.clyde.prefix, "")) ? parts[0].toLowerCase().replace(config.bots.clyde.prefix, "") : "undefined") || "undefined";

                                if(serverCommands[plugin])
                                {
                                    const pluginCMD = config.bots.clyde.prefix + serverCommands[plugin].commando;
                                    if(cmd.startsWith(config.bots.clyde.prefix) && pluginCMD === parts[0].toLowerCase()) {
                                        if(permission >= serverCommands[plugin].userLevel || serverCommands[plugin].userLevel === 0)
                                        {
                                            if(spam(author.id) === false)
                                            {
                                                parts.splice(0, 1);
                                                try {
                                                    message.delete().then(msg => {
                                                        if(Test(message, serverCommands[plugin], parts) === true)
                                                        {
                                                            const DSObj = {
                                                                message: message,
                                                                channel: channel,
                                                                guild: guild,
                                                                author: author,
                                                                discord: discord,
                                                                parts: parts
                                                            };
                
                                                            serverCommands[plugin].runCommand(DSObj);
                                                        }
                                                    });
                            
                                                } catch (err) { }
                                            }else{
                                                message.delete().then(msg => {
                                                    message.reply("Please wait a few seconds before you can run another command.").then(msg => msg.delete(5000))
                                                    .catch((err) => {});
                                                });
                                            }
                                        }else{
        
                                            message.delete().then(msg => {
                                                channel.startTyping(4000);
                                                setTimeout(() => {

                                                    channel.send(`I'm sorry, you can't use this command right now. See \`${config.bots.clyde.prefix}help\` to see what I can do for you instead.`).then(msg => {
                                                        msg.delete(5000);
                                                        channel.stopTyping(true);
                                                    })
                                                    .catch((err) => {});

                                                }, 4000);
                                            });

                                        }
                                    }
                                }
                            }
                        }
                    });
                } catch (err) { }
            }
        });
    }
};