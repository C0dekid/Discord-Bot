let discord = null;
const config = require('../../conf');
const spam = require("../../helpers/Antispam");
const mysql = require("../../bot/libs/mysql").useDB();

module.exports = {
    name: "Skid Game",
    description: "Who is talking about skids a lot?",
    enabled: true,
    randomMessage: (newCount, uid) => {
        const RandomLines = [
            `You said skid ${newCount} time(s).`,
            `Did you know that <@${uid}> said 'skid' like ${newCount} times?`,
            `Call the skid-squad, said the word 'skid' like ${newCount} times.`,
            `Ugh... you never get tired of saying skid? You still didn't run out of energy after saying it ${newCount} times`,
            `I think you've got an obsession with skids. You called them out ${newCount} times`,
            `You got a skid fetish ain't you? You said it ${newCount} times, you've just exposed yourself.`,
            `You love to say skid, right? Because you said it like ${newCount} times.`,
            `We have counted ${newCount} skids in our server.`
        ];

        return RandomLines[Math.floor(Math.random() * RandomLines.length)];
    },
    checkPoints: (uid) => {
        return new Promise((resolve, reject) => {
            mysql.query("SELECT counts FROM bot_skidcount WHERE count_user_id = ?", [uid], (err, rows, field) => {
                if(rows.length === 0)
                {
                    reject('no_user_found');
                }else{

                    resolve(rows[0].counts);
                }
            });
        });
    },
    setPoints: (uid) => {
        mysql.query("SELECT counts, count_user_id FROM bot_skidcount WHERE count_user_id = ?", [uid], (err, rows, fields) => {
            if(err)
            {
                Log.e("MySQL", err);
            }

            if(rows.length == 0)
            {
                mysql.query("INSERT INTO bot_skidcount SET counts = 1, count_user_id = ?", [uid], (err, rows, fields) => {
                    if(err)
                    {
                        Log.e("MySQL", "Something went wrong by adding the user to the skidcount list. Error: " + err);
                    }
                });
            }else{

                mysql.query("UPDATE bot_skidcount SET counts=counts+1 WHERE count_user_id=?", [uid]);
            }
        });
    },
    adminPoints: (uid, amount, operator) => {
        return new Promise((resolve, reject) => {
            mysql.query("SELECT counts, count_user_id FROM bot_skidcount WHERE count_user_id = ?", [uid], (err, rows, fields) => {    
                if(rows.length == 0)
                {
                    reject("user_not_found");
                    
                }else{
                    if(operator && operator == "+")
                    {
                        const newPoints = rows[0].counts++;
                        console.log(newPoints);
                        mysql.query("UPDATE bot_skidcount SET counts = ? WHERE count_user_id = ?", [uid, newPoints], (err, rows, fields) => {
                            if(err) {
                                reject(err);
                            }else{
                                resolve("edited");
                            }
                        });
                    }else{
                        let newPoints = parseInt(rows[0].counts - amount);
                        if(newPoints < 0)
                        {
                            newPoints = 0;
                        }
                        mysql.query("UPDATE bot_skidcount SET counts = ? WHERE count_user_id = ?", [uid, newPoints], (err, rows, fields) => {
                            if(err) reject(err);
                        });
                    }
                }
            });
        });
    }
};