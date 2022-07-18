const auths = require("../utilities/auths");

const command_names = [
    "sendembedmessage",
    "sendmessage",
    "sem"
];

const info = {
    commands_aliases: [
        { "Embed message": command_names }
    ],
    information: "Simple command for a complex embed message",
    emoji: "📫"
}

const config = (event) => {
    event.on("messageCreate", async (bot, Response, msg) => {

        if( !auths.checkId( msg )) return;

        if(command_names.includes( Response.command )){
            if( Response.nArgs > 1){
                const args = Response.args;
                let channel = await bot.channels.fetch( args[0] );
                if(channel && channel.isText() && channel.type == "GUILD_TEXT"){
                    let member = channel.guild.me;
                    if( member && channel.permissionsFor(member).has("SEND_MESSAGES")){
                        Response.prepareEmbedResponse({
                            description: Response.args.slice(1,args.length).join(" ")
                        })
                    }else{
                        Response.prepareEmbedResponse({
                            title: "Oops",
                            description: "I can't see / text that channel..."
                        });
                        
                    }
                }else{
                    Response.prepareEmbedResponse({
                        title: "Oops",
                        description: "I couldn't deliver the message :("
                    });
                }
                Response.sendEmbedResponse();
            }
        }
    });

    return info;
}
module.exports = config;