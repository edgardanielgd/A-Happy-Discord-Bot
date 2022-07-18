const Discord = require("discord.js");
const { InteractionButtonStatsInterval, InteractionTimeDelete } = require("./config.json");
const { checkExistence } = require("./../../utilities/messageExistence");
const { editMessage } = require("./../../utilities/responseManager");

const updateDisplay = "Update";
const retryDisplay = "Retry";

const pkgEmbedRow = {
    update : async ( msg, retrying ) => {

        if( ! msg ) return;

        const diffTime = new Date() - msg.createdAt;

        if( diffTime >= InteractionTimeDelete - InteractionButtonStatsInterval)
            return;
            //No more updates

        let row = new Discord.MessageActionRow();
        let button1 = new Discord.MessageButton();
        button1.setDisabled( true );
        if( !retrying){
            button1.setCustomId("Update");
            button1.setLabel(updateDisplay+" (" + (InteractionButtonStatsInterval / 1000) + " secs )");
            button1.setStyle("SUCCESS");    
        }else{
            button1.setCustomId("Retry");
            button1.setLabel(retryDisplay+" (" + (InteractionButtonStatsInterval / 1000) + " secs )");
            button1.setStyle("DANGER"); 
        }
        row.addComponents( button1 );

        editMessage( msg, {
            components: [ row ]
        });

        setTimeout( async (msg) => {
            const exists = await checkExistence(msg);
            if( exists ){
                editMessage( msg, {
                    //Deletes action row
                    components: [ ]
                });
            }
        }, InteractionTimeDelete, msg);

        setTimeout( async (msg) => {
            const exists = await checkExistence(msg);
            if( exists ){
                const components = msg.components;
                if(components && components.length > 0){
                    const rowComps = components[0].components;
                    if( rowComps && rowComps.length > 0){
                        const button = rowComps[0];
                        button.setLabel( button.customId == "Update" ? updateDisplay : retryDisplay );
                        button.setDisabled( false );
                        const newRow = new Discord.MessageActionRow();
                        newRow.addComponents( button );
                        editMessage( msg, {
                            //Deletes action row
                            components: [ newRow ]
                        });
                    }
                }
                
            }
        }, InteractionButtonStatsInterval, msg)

    }
}

module.exports = pkgEmbedRow;