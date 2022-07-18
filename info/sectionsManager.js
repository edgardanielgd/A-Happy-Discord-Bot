const Discord = require("discord.js");
const customId = "helpNavigator"

class SectionManager{
    constructor( commands_list ){
        this.list = commands_list;
        this.id = customId;
    }

    genSelectMenu = () => {
        const menu = new Discord.MessageSelectMenu();
        menu.setCustomId( customId );

        this.list.forEach( section => {
            menu.addOptions({
                label: section.name,
                value: section.id,
                emoji: section.emoji
            });
        });

        return menu;
    }

    getSection = ( interaction ) => {
        if( interaction.customId === this.id ){
            const values = interaction.values;
            if( values.length > 0){
                return this.list.find( section => section.id === values[0] );    
            }
        }
    }
}
module.exports = SectionManager;