const { addReaction } = require("./../utilities/responseManager");

const command_names = [
    "hello",
    "hi",
    "hey",
    "sup",
    "wassup",
    "sayhi",
    "say_hi"
];

const info = {
    commands_aliases: [
        { "Greetings command": command_names }
    ],
    information: "Say hi to this friendly bot!!",
    emoji: "🖐️"
}

const config = (event) => {
    event.on("messageCommand", async (bot, Response, msg) => {
        if(command_names.includes( Response.command )){
            Response.prepareEmbedResponse({
                title: "Hey",
                description: "You can see $help if you want to discover my function",
                author: {
                    text: "Good morning/afternoon/night"
                },
            });
            
            Response.sendEmbedResponse();
        }
    });

    event.on("messageCreate", async (bot, Response, msg, securityManager) => {
        
        if( msg.mentions.has( bot.user.id ) && ! msg.mentions.everyone){

            if( !securityManager.allowIncomingMessage( msg.author ) ) return;

            if( msg.mentions.repliedUser && msg.mentions.repliedUser.id === bot.user.id ){
                addReaction(msg, "👀");
            }else{
                Response.prepareEmbedResponse({
                    title: "Yes yes im awake... (zzZ)",
                    description: "Type $help",
                });
                Response.sendEmbedResponse();
            }
        }
    });

    return info;
}

module.exports = config;