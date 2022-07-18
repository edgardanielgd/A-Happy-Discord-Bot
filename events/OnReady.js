const config = ( bot, event ) => {

    bot.on( "ready", ( ) => {
        event.emit("running", bot);
    });
}

module.exports = config;