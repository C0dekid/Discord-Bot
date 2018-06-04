let discord = null;
const config = require('../../conf');

module.exports = {
    enabled: false,
    requireDiscord: false,
    setClient: (client) => {
        discord = client;
    },
    run: () => {
    }
};