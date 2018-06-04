let clrs    = require("colors");
let moment  = require("moment");
let config  = require('./conf');

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
	  if ((new Date().getTime() - start) > milliseconds){
		break;
	  }
	}
}

module.exports = {
	i: function(t, m) { console.log(clrs.cyan("[" + moment().format("HH:mm:ss") + "] I/" + t + ":", m)); sleep(200); },
	d: function(t, m) { console.log(clrs.white("[" + moment().format("HH:mm:ss") + "] D/" + t + ":", m)); sleep(200); },
	e: function(t, m) { console.log(clrs.red("[" + moment().format("HH:mm:ss") + "] E/" + t + ":", m)); sleep(200); },
	v: function(t, m) { console.log(clrs.gray("[" + moment().format("HH:mm:ss") + "] V/" + t + ":", m)); sleep(200); },
	w: function(t, m) { console.log(clrs.yellow("[" + moment().format("HH:mm:ss") + "] W/" + t + ":", m)); sleep(200); },
	init: function() {
		// ascii.Figlet.fontPath = 'Fonts';

		return;
	}
};