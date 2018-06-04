module.exports = {
    Test: (message, plugin, parts) => {
        const argumentList = plugin.arguments.argumentList;
        const required = [];

        for(let i = 0; i < argumentList.length; i++)
        {
            if(argumentList[i].optional === false) {
                required.push(argumentList[i]);
            }
        }
        
        for(let i = 0; i < required.length; i++)
        {
            if(parts.indexOf(parts[i]) === i && required[i].optional === false)
            {
                const reg = new RegExp(required[i].regex);
                
                if(!reg.test(parts[i]))
                {
                    message.reply(`The argument you have given is invalid! It must be ${required[i].mustBe}.`);

                    return false;

                }
                
                continue;

            }else{
                message.reply("The command is not complete! Please enter all required arguments.");
                return false;
            }
        }

        return true;
    },
    isInt: (integer) => {
        const reg = new RegExp(/^([0-9])+$/g);
        if(reg.test(integer)) {
            return true;
            
        }
        return false;
    },
    isString: (string) => {
        const reg = new RegExp(/^([a-z-A-Z])+$/g);
        if(reg.test(string)) {
            return true;
            
        }
        return false;
    },
    isMixed: (string) => {
        const reg = new RegExp(/^([a-z-A-Z0-9!@#$%^&*()-_=+/?.,<>;:])+$/g);
        if(reg.test(string)) {
            return true;
            
        }
        return false;
    }
};