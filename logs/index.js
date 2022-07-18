const { privateId } = require("./../config/config");
const { logsChannel } = require("./config.json");
const { sendMessage } = require("./../utilities/responseManager");
var channel = null;

const getFormLogData = ( fields ) => {
  let returnString = "";

  for( const row of fields.components ){
    for( const component of row.components ){
      returnString += `${component.customId} : ${component.value}\n`;
    }
  }

  return returnString;
}

const getCommandOptionsData = (options) => {
    let returnString = "";

    for( const option of options ){
        returnString += `${option.name} : ${option.value}\n`;
    }

    return returnString;
}

config = async (event, bot) => {
    channel = await bot.channels.fetch( logsChannel );
    if( channel ){
        event.on("messageCommand", async (_, Response, msg) => {
            if( Response.dm ){
                let log = new Date().toLocaleString("es-ES",{
                    timeZone: "America/New_York"
                }) + "\n" +
                "User: " + msg.author.username + "#" + msg.author.discriminator + "\n"+
                "Command text: " + msg.content;
                sendMessage( channel, {
                    content: log
                });
            }        
        });

        event.on("interactionButton", async (_, interaction) => {
            if( interaction.channel.type == "DM" || interaction.channel.type == "GROUP_DM" ){
                let log = new Date().toLocaleString("es-ES",{
                    timeZone: "America/New_York"
                }) + "\n" +
                "User: " + interaction.user.username + "#" + interaction.user.discriminator + "\n"+
                "Interaction type: " + interaction.customId + "\n" +
                "Values: " + interaction.values;
                sendMessage( channel, {
                    content: log
                });
            }
        });
        
        event.on("interactionSelectMenu", async (_, interaction) => {
            if( interaction.channel.type == "DM" || 
                interaction.channel.type == "GROUP_DM" || 
                interaction.customId == "ServersListMenu"){
                    
                let log = new Date().toLocaleString("es-ES",{
                    timeZone: "America/New_York"
                }) + "\n" +
                "User: " + interaction.user.username + "#" + interaction.user.discriminator + "\n"+
                "Interaction type: " + interaction.customId + "\n" +
                "Values: " + interaction.values;
                sendMessage( channel, {
                    content: log
                });
            }
        });

        event.on("interactionSlashCommand", async (_, interaction) => {
            if( interaction.channel.type == "DM" || 
                interaction.channel.type == "GROUP_DM"){
                    
                let log = new Date().toLocaleString("es-ES",{
                    timeZone: "America/New_York"
                }) + "\n" +
                "User: " + interaction.user.username + "#" + interaction.user.discriminator + "\n"+
                "Command name: " + interaction.commandName + "\n" +
                "Values: " + getCommandOptionsData( interaction.options.data );

                sendMessage( channel, {
                    content: log
                });
            }
        });

        event.on("interactionFormSubmit", async (_,interaction) => {
            let log = new Date().toLocaleString("es-ES",{
                timeZone: "America/New_York"
            }) + "\n" +
            "User: " + interaction.user.username + "#" + interaction.user.discriminator + "\n"+
            "Interaction type: " + interaction.customId + "\n" +
            "Values: " + getFormLogData(interaction.fields);

            sendMessage( channel, {
                content: log
            });
        });          
    }
    
}

module.exports = config;