const glob = require("glob");
const mysql = require("../libs/mysql").useDB();
const config = require('../../conf');

const { hex2decimal } = require("../../helpers/Colors");
const { isInt } = require("../../helpers/MessagesHelper");

let permission = 0;
let commands = [];

module.exports = {
    enabled: true,
    userLevel: 0,
    commando: "help",
    description: "Want to know what I can do? Just enter `!help` and I will return you a list with available commands.",
    arguments: {
        argumentList: []
    },
    runCommand: (messageObj) => {
        const message = messageObj.message;
        const channel = messageObj.channel;
        const author = messageObj.author;
        const nickname = message.guild.members.get(author.id).nickname || author.username;

        if (!process.env.PWD) {
            process.env.PWD = process.cwd();
        }

        const evtFolder = `${config.folders.commands}`;
        glob(process.env.PWD + "/bot" + evtFolder + "/*.js", (err, files) => {
            
            if(err) {
                Log.e("HelpCommand", "This folder is empty, cannot be accessed or does not exists!");
            }else{

                if(files.length === 0)
                {
                    Log.w("HelpCommand", "This folder is empty, skipping.");
                    channel.send("Sorry, there are no available commands!").catch((err) => {});

                }else{
                    const uid = (isInt(author.id) ? author.id : "0");
                    
                    mysql.query("SELECT permission_level FROM bot_user_permissions WHERE permission_uid = ?", [uid], (err, rows, fields) => {
                        if(err) {

                            Log.e("MySQL", "Cannot get the users permission table. Error: " + err);
                        }

                        let level = 0;
                        if(rows.length == 1)
                        {
                            level = rows[0].permission_level;
                        }

                        commands = [];
                        permission = level || 0;
                        files.forEach(file => {
                            const plugin = require(file);

                            if(permission >= plugin.userLevel || plugin.userLevel === 0)
                            {
                                if(plugin.enabled === true) {
                                    commands.push({
                                        command: config.bots.clyde.prefix + plugin.commando,
                                        desc: plugin.description,
                                        arguments: plugin.arguments.argumentList
                                    });
                                }
                            }
                        });

                        const getCommands = () => {
                            let messages = [];
                            let b = [];
                            for(let i = 0; i < commands.length; i++)
                            {
                                let cmdArguments = [];
                                if(commands[i].arguments.length > 0)
                                {
                                    
                                    for(let a = 0; a < commands[i].arguments.length; a++)
                                    {
                                        let x = "";
                                        if(commands[i].arguments[a].optional === false)
                                        {
                                            x = `<${commands[i].arguments[a].name}>`;
                                        }else{
                                            x = `(${commands[i].arguments[a].name})`;
                                        }
                                        cmdArguments.push(`\`${x}\``);
                                    }
                                }

                                messages.push("`" + commands[i].command + "` " +  cmdArguments.join(" ") + "\r\n" + commands[i].desc);
                            }

                            return messages.join("\r\n\r\n");
                        };
                        
                        author.send({embed: {
                            color: hex2decimal('#7289DA'),
                            author: {
                                name: `Greetings from ${config.bots.clyde.nickname}`,
                                icon_url: "http://io.jer.p00.nl/assets/images/f78426a064bc9dd24847519259bc42af.png"
                            },
                            title: 'Available commands for you',
                            description: `Hello ${nickname}! It seems that you need some help. Below you can find some information about the commands I know. If you use one of the commands in the servers i'm in, I will do some magic! Commands with \`< >\` are required and \`( )\` are optional.  \r\n\r\n` + getCommands()
                        }})
                        .catch((error) => {
                            
                            channel.send(`Well.. this is awkward! I'm really sorry ${nickname}! I couldn't deliver the message to your inbox, please enable direct message from server members. This option is for this server only and can be turned off later if you want.`,
                            {
                                files: ['https://evaljs.eu/guild_privacy_settings.gif']
                            }).then(msg => delete(20000))
                            .catch((err) => {});
                        });
                    });
                }
            }
        });
    }
};