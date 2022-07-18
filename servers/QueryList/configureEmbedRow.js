const Discord = require("discord.js");
const { InteractionButtonStatsInterval, InteractionTimeDelete } = require("./config.json");
const { checkExistence } = require("./../../utilities/messageExistence");
const { editMessage } = require("./../../utilities/responseManager");

const updateDisplay = "Update";

const pkgEmbedRow = {
    update : async ( msg, menu) => {

        if( ! msg ) return;

        const diffTime = new Date() - msg.createdAt;

        if( diffTime >= InteractionTimeDelete - InteractionButtonStatsInterval){
          editMessage( msg, {
              //Deletes action rows
              components: [ ]
          });
          return;
        }

        let row = new Discord.MessageActionRow();
        let button1 = new Discord.MessageButton();
        button1.setDisabled( true );
        button1.setCustomId("UpdateList");
        button1.setLabel(updateDisplay+" (" + (InteractionButtonStatsInterval / 1000) + " secs )");
        button1.setStyle("SUCCESS");

        row.addComponents( button1 );
        const arrComponents = [ row ];

        if( menu ){
            let rowMenu = new Discord.MessageActionRow();
            rowMenu.addComponents( menu );
            arrComponents.push( rowMenu );
        }else{
            const components = msg.components;

            if( components && components.length > 0 ){
                const menuRowComps = components[0].components;
                if( menuRowComps && menuRowComps.length > 0){
                    // Adds again menu row
                    arrComponents.push( components[0] );
                }
            }
        }

        
        editMessage( msg, {
            components: arrComponents
        });

        setTimeout( async (msg) => {
            const exists = await checkExistence(msg);
            if( exists ){
                editMessage( msg, {
                    //Deletes action rows
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

                        button.setLabel( updateDisplay );
                        button.setDisabled( false );
                        
                        const newComponents = [];

                        const newRow = new Discord.MessageActionRow();
                        newRow.addComponents( button );
                        newComponents.push( newRow );
                        
                        if( components.length > 1 ){
                            const menuRowComps = components[1].components;
                            if( menuRowComps && menuRowComps.length > 0){
                                // Adds again menu row
                                newComponents.push( components[1] );
                            }
                        }

                        editMessage( msg, {
                            //Deletes action row
                            components: newComponents
                        });
                    }
                }
                
            }
        }, InteractionButtonStatsInterval, msg)

    },

    prepareUpdate : async (msg) => {
        const components = msg.components;

        if( components.length >= 2){
            const rowsWithoutUpdateButton = components.slice( 1 );

            await editMessage(
                msg,
                {
                    components : rowsWithoutUpdateButton
                }
            );
        }
    }
}

module.exports = pkgEmbedRow;