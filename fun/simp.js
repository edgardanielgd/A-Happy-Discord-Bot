const mg = require("./../utilities/messageGenerator");
// const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js"); v14
const command_names = [
    "simp",
    "soysimpde",
    "iamsimpof"
];

const info = {
    commands_aliases: [
        { "Siiiimp command": command_names }
    ],
    information: "Are you a simp at all?",
    emoji: "👀"
}

const slashCommandData = {
    name: "simp",
    description: "Simp someone.. (Stop simping whiskas)",
    type: "CHAT_INPUT",
    options: [
        { 
            name: "user",
            type : "USER",
            description : "The user you want to simp to...",
            required: true
        }
    ]
};

const searchUser = async (Response) => {

    const msg = Response.msg;

    if( Response.nArgs === 0)
        return msg.author;
    
    const mentions = msg.mentions;
    if( mentions && mentions.users && mentions.users.size > 0){
        return mentions.users.first();
    }
    if( !Response.dm ){
        let results = await msg.guild.members.search({
            query: Response.args[0]
        });
        if(results.size > 0)
            return results.first().user;
    }
    return null;
}

const config = (event, ssc) => {

    ssc.addCommand( slashCommandData );

    event.on("messageCommand", async (bot, Response, msg) => {
        if(command_names.includes( Response.command )){
            const user = await searchUser ( Response );
            if( user ){
                Response.prepareEmbedResponse({
                    title: user.username,
                    image: {
                        url: user.displayAvatarURL({
                            dynamic:true,
                            format:"png"
                        })+"?size=2048"
                    }
                });
            }else{
                Response.prepareEmbedResponse({
                    title: "Error",
                    description: "Couldn't find that user"
                });
            }
            Response.sendEmbedResponse();
        }
    });

    event.on("interactionSlashCommand", async( bot, interaction) => {
        if( interaction.commandName == "simp" ){
            
            const user = interaction.options.getUser("user");
            const Response = new mg( interaction, true);

            Response.prepareEmbedResponse({
                title: user.username,
                image: {
                    url: user.displayAvatarURL({
                        dynamic:true,
                        format:"png"
                    })+"?size=2048"
                }
            });
            
            Response.sendEmbedResponse();
        }
    });

    return info;
}
module.exports = config;
