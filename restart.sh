#! /bin/bash

if [ $1 == 'stop' ]
	then
	forever stop /home/jer/io/Clyde/bot.js

	echo "Bot(s) stopped.";

fi

if [ $1 == 'start' ]
	then
	truncate -s 0 /home/jer/io/Clyde/logs/*.log
	forever start -l /home/jer/io/Clyde/logs/logfile.log -a /home/jer/io/Clyde/bot.js

	echo "Bot(s) started"
fi

if [ $1 == 'restart' ]
	then

	truncate -s 0 /home/jer/io/Clyde/logs/*.log

	forever stop /home/jer/io/Clyde/bot.js
	forever start -l /home/jer/io/Clyde/logs/logfile.log -a /home/jer/io/Clyde/bot.js

	echo "Bot(s) restarted.";
fi

if [ $1 == 'debug' ]
	then
	forever stop /home/jer/io/Clyde/bot.js
	nodemon /home/jer/io/Clyde/bot.js
fi
