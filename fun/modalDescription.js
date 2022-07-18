const Discord = require("discord.js");

const { sendMessage } = require("./../utilities/responseManager");
const MaintenanceSender = require("./../logs/DM_maintenance");

const command_names = [
    "description",
    "funother",
    "describeother"
];

const buttonId = "descriptionFunButton";
const submitId = "descriptionFunForm";

const info = {
    commands_aliases: [
        { "Describe someone": command_names }
    ],
    information: "Describe someeone...",
    emoji: "👀"
}

const config = (event) => {
    event.on("messageCommand", async (bot, Response, msg) => {
        if(command_names.includes( Response.command )){

          const row = new Discord.MessageActionRow();
          const button = new Discord.MessageButton();

          button.setCustomId( buttonId );
          button.setStyle( "PRIMARY" );
          button.setLabel( "Click me!" );
          
          row.addComponents( button );
          
          sendMessage( msg.channel, {
            content: "Click the button below!",
            components: [
              row
            ]
          });
            
        }
    });

    event.on("interactionButton", async (bot, interaction) => {
        try{
            if(interaction.customId === buttonId ){
              const modal = new Discord.Modal()
                  .setCustomId( submitId )
                  .setTitle("Who are you going to describe?");
              
              const name = new Discord.TextInputComponent()
                .setCustomId('targetname')
                .setLabel("Who are you going to describe?")
                  
                .setStyle('SHORT');
              
              const row1 = new Discord.MessageActionRow()
                .addComponents(name);

              const description = new Discord.TextInputComponent()
                .setCustomId('targetdescription')
                .setLabel("Give a little description now :P")
                  
                .setStyle('PARAGRAPH');
              
              const row2 = new Discord.MessageActionRow()
                .addComponents(description);
              
              modal.addComponents( row1, row2 );
              
              await interaction.showModal( modal );
              
            }
        }catch(e){
            MaintenanceSender( bot, "Error: \n" + e);
        }
    });

    event.on("interactionFormSubmit", async (bot, interaction) => {
        try{
            if(interaction.customId == submitId ){
              interaction.deferUpdate();
              const name = interaction.fields.getTextInputValue("targetname");
              const description = interaction.fields.getTextInputValue("targetdescription");
              
              const embed = new Discord.MessageEmbed()
                .setDescription(
                  "```"+
                  `Se dice que ${name} es ${description}`+
                  "```" 
                );

              sendMessage( interaction.message.channel,{
                embeds: [embed]
              });
            }
        }catch(e){
            MaintenanceSender( bot, "Error: \n" + e);
        }
    });
    return info;
}
module.exports = config;
