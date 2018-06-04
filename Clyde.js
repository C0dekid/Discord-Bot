const glob = require('glob');
const config = require('./conf');

module.exports = (DiscordClient) => {
    if (!process.env.PWD) {
        process.env.PWD = process.cwd();
    }

    Log.i('ClydeCore', 'Instructions received. Locating my food I need to consume before I can do some more.');
    const evtFolder = `${config.folders.events}`;

    try {
        glob(process.env.PWD + "/bot" + evtFolder + "/*.js", (err, files) => {
            console.log(`Scanning folder '${evtFolder}' for javascript files.`);
            if(err)
            {
                Log.e("ClydeCore", "Something happend, folder or files do not exists or cannot be loaded!");
    
            }else{
                if(files.length === 0)
                {
                    Log.w('ClydeCore', 'There are no files located in this folder.');

                }else{
                    files.forEach(file => {
                        const plugin = require(file);
                        const depencency = file.split('/');

                        if(plugin.enabled !== undefined && plugin.enabled === true)
                        {
                            Log.v(depencency[depencency.length-1].replace(".js", ""), "Event File is loaded");
                            if(plugin.requireDiscord === true)
                            {
                                plugin.setClient(DiscordClient);
                            }
                            
                            plugin.run();
                        }else{

                            const name = require.resolve(file);
                            delete require.cache[name];

                            Log.w(depencency[depencency.length-1].replace(".js", ""), "This event is not enabled, skipping the require.");
                        }
                    });
                }
            }
        });
    } catch (err)
    {
        // Unhandled exception errors;
    }
};