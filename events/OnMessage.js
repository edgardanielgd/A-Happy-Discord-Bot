const mg = require("../utilities/messageGenerator");

const config = ( bot, event , securityManager) => {

    bot.on( "messageCreate", ( msg ) => {
        if( msg.author.bot) return;
        const Response = new mg( msg );
        if( Response.isValid ){
            if( !securityManager.allowIncomingMessage( msg.author ) ) return;
            event.emit( "messageCommand", bot, Response, msg);
        }
        else
            event.emit( "messageCreate", bot, Response, msg, securityManager);
    });
}

module.exports = config;


