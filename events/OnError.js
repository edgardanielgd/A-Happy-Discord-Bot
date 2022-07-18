const config = ( bot, event ) => {

    bot.on( "error", (e ) => {
        console.log("Bot error: "+e);
    });
}

module.exports = config;