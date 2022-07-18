const auths = require("./../utilities/auths");
const { sendMessage } = require("./../utilities/responseManager");

const command_names = [
    "sendsimplemessage",
    "send_simple_message",
    "ssm"
];

const info = {
    commands_aliases: [
        { "Simple Message Command": command_names }
    ],
    information: "Simple command for simple messages",
    emoji: "📧"
}

const config = (event) => {
    event.on("messageCommand", async (bot, Response, msg) => {

        if( !auths.checkId( msg )) return;

        if(command_names.includes( Response.command )){
            if( Response.nArgs > 1){
                const args = Response.args;
                let channel = await bot.channels.fetch( args[0] );
                if(channel && channel.isText() && channel.type == "GUILD_TEXT"){
                    let member = channel.guild.me;
                    if( member && channel.permissionsFor(member).has("SEND_MESSAGES")){
                        sendMessage( channel, {
                            content: Response.args.slice(1,args.length).join(" ")
                        });
                    }else{
                        Response.prepareEmbedResponse({
                            title: "Oops",
                            description: "I can't see / text that channel..."
                        });
                        Response.sendEmbedResponse();
                    }
                }else{
                    Response.prepareEmbedResponse({
                        title: "Oops",
                        description: "I couldn't deliver the message :("
                    });
                    Response.sendEmbedResponse();
                }
            }
        }
    });

    return info;
}
module.exports = config;