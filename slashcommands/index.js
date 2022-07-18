// Commands are managed by every subfolder and file, as message commands do

// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
// const { token } = require("./../config");

const sendDM = require("./../logs/DM_maintenance");

class slashCommandsConstructor{
    constructor() {
        this.commands = [];
    }

    addCommand( data ) {

        if( Array.isArray( data ) )
            this.commands.push( ...data );
        else
            this.commands.push( data );
    }

    registerCommands( bot ) {

        const appCommands = bot.application.commands;
        const botGuilds = bot.guilds.cache;

        for( const command of this.commands ){
            appCommands.create( command );
            
            botGuilds.forEach(
                async ( guild ) => {
                    try{
                        await appCommands.create( command, guild.id);  
                    }catch( e ){
                        sendDM(bot, `Missing permisions for ${guild.name}` );
                    }
                  
                }
            )
        }
    }

}


module.exports = slashCommandsConstructor;