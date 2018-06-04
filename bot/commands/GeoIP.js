module.exports = {
    enabled: true,
    userLevel: 0,
    commando: "geoip",
    description: "This commando provides you some basic IP information about an IP address or website.",
    arguments: {
        argumentList: [
            {
                optional: false,
                name: "url",
                mustBe: "a IP address or url",
                notAllowed: [],
                regex: /^([a-zA-Z0-9.:/])+$/g
            }
        ]
    },
    runCommand: (messageObj) => {
        const message = messageObj.message;
        const channel = messageObj.channel;
        const author = messageObj.author;
        const args = messageObj.parts;

        const nickname = message.guild.members.get(author.id).nickname || author.username;
        const WR = require("../libs/Webresolver");

        WR.GeoIP(args[0]).then(result => {
            if(result.error) {
                channel.send(result.error)
                .catch((erro) => {});

            }else{
                channel.send({
                    embed: {
                        color: 3447003,
                        fields: [
                            {
                                name: "IP / Hostname",
                                value: result.ip + " / " + result.hostname
                            },
                            {
                                name: "Country details",
                                value: `City: ${result.records.city} (${result.records.country_name}, ${result.records.region.name})`
                            },
                            {
                                name: "ISP",
                                value: `ISP/ASN: ${result.records.isp} (${result.records.asn})`
                            },
                            {
                                name: "Disclaimer",
                                value: "This information has been provided by Webresolver.nl's API."
                            },
                        ]
                    }
                })
                .catch((erro) => {});
            }
        })
        .catch((err) => {
            // unhandled rejection
        });
    }
};