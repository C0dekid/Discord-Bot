let Authors = [];
let now = Date.now();
let isSpam = false;

const config = require("../conf");

/**
 * @param {integer} id ID of Author
 * @param {integer} timeout Timeout in seconds
 * @returns {boolean} Returns true or false
*/
const Antispam = (id, timeout) => {
    if(config.bots.clyde.maintenance === true && config.bots.clyde.developers.indexOf(id) !== -1)
    {
        return false;
    }

    const t = timeout || 10;

    if(typeof(Authors[id]) === "undefined") {
        Authors[id] = { then: Date.now() }
        return false;
    }
    Authors[id].then = Date.now();
    isSpam = Math.round((Authors[id].then - now) / 1000) < t;

    now = Date.now();
    return isSpam;
};

module.exports = Antispam;