
const config = ( bot, event, securityManager) => {

    bot.on( "interactionCreate", ( interaction ) => {
        if(interaction.user.bot) return;
        if( !securityManager.allowIncomingMessage( interaction.user ) ) return;
        if(interaction.client.user.id == bot.user.id){
            if( interaction.isButton() )
                event.emit("interactionButton", bot, interaction );
            else if( interaction.isSelectMenu() )
                event.emit("interactionSelectMenu", bot, interaction);
            else if( interaction.isModalSubmit() )
                event.emit("interactionFormSubmit", bot, interaction);
            else if( interaction.isCommand() )
                event.emit("interactionSlashCommand", bot, interaction );
        }
    });
}

module.exports = config;


