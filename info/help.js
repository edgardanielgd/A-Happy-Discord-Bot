const Discord = require("discord.js");
const { sendMessage, editMessage, replyMessageOrInteraction } = require("./../utilities/responseManager");
const SectionManager = require("./sectionsManager");
const mg = require("./../utilities/messageGenerator");

const command_names = [
    "help",
    "helpme",
    "whothehellareyou"
];

const slashCommandData =
    {
        name: "help",
        description: "Not that kind of help...",
        type: "CHAT_INPUT"
    };

const info = {
    commands_aliases: [
        { "Help command": command_names }
    ],
    information: "See what can do you with this",
    emoji: "❔"
}

const general_bot_info = {
    description: "Please navigate throught the select menu" +
    "\n```"+
    "Important: DM commands and interactions on DM related to this bot functions will be logged"+
    "\n```"
}

const genEmbedOptions = ( section ) => {
    let title = section.emoji;

    let description = "`Name:` " + section.name + "\n\n";
    const components = section.components;
    if( components ){
        components.forEach( component => {
            description += "`" + component.emoji + " " +
                component.information + "`\n";
            const commands = component.commands_aliases;
            let count = 1;
            if( commands ){
                commands.forEach( command => {
                    description += "```\n";
                    for( key in command ){
                        description += 
                            count++ + ". " + key + "\n" +
                            "\t" + command[ key ].join(" | ") + "\n";
                    }
                    description += "\n```\n\n";
                })
            }
        });
    }
    return {
        title,
        description
    }


}

const config = (event, commands_list, selfExport, scc) => {
    
    selfExport.components.push( info );
    commands_list.push( selfExport );

    scc.addCommand( slashCommandData );

    const sectionManager = new SectionManager( commands_list );

    event.on("messageCommand", async (bot, Response, msg) => {
        if(command_names.includes( Response.command )){
            const actionRow = new Discord.MessageActionRow();

            actionRow.addComponents( sectionManager.genSelectMenu() );

            Response.prepareEmbedResponse({
                title: "This is my help menu",
                description: general_bot_info.description
            });

            sendMessage( msg.channel, {
                embeds: [ Response.embed ],
                components: [ actionRow ]
            })

        }
    });

    event.on("interactionSlashCommand", async( bot, interaction) => {
        if( interaction.commandName == "help" ){
            const actionRow = new Discord.MessageActionRow();

            const Response = new mg( interaction, true );

            actionRow.addComponents( sectionManager.genSelectMenu() );

            Response.prepareEmbedResponse({
                title: "This is my help menu",
                description: general_bot_info.description
            });

            replyMessageOrInteraction( interaction, {
                embeds: [ Response.embed ],
                components: [ actionRow ]
            })
        }
    });

    event.on("interactionSelectMenu", async( bot, interaction) => {
        const section = sectionManager.getSection( interaction );

        if( section ){
            interaction.deferUpdate();

            const message = interaction.message;
            if( message && message.embeds && message.embeds.length > 0){
                const embed = message.embeds[0];
                const { title, description } = genEmbedOptions( section );

                embed.setTitle( title );
                embed.setDescription( description );

                editMessage( message, {
                    content: 
                        "Updated by: " +  interaction.user.username 
                        + "#" + interaction.user.discriminator,
                    embeds: [ embed ]
                })
            }
        }
    });
}
module.exports = config;