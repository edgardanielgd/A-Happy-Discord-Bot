const checkAdmin = require("./checkAdministrator");

const command_new_av_names = [
    "new_av",
    "change_av",
    "set_av"
];
const command_new_name_names = [
    "new_name",
    "change_name",
    "set_name"
];
const command_new_activity_names = [
    "new_activity",
    "change_activity",
    "set_activity"
];
const command_new_status_names = [
    "new_status",
    "change_status",
    "set_status"
];
const info = {
    commands_aliases: [
        { "Refresh my avatar": command_new_av_names },
        { "Refresh my name": command_new_name_names },
        { "Refresh my activity": command_new_activity_names },
        { "Refresh my status": command_new_status_names }
    ],
    information: "Change bot appearance",
    emoji: "✂️"
}

const config = (event) => {
    event.on("messageCommand", async (bot, Response, msg) => {

        if( ! checkAdmin( msg )) return;

        if( command_new_av_names.includes( Response.command ) ){
            if( Response.nArgs > 0){
                bot.user.setAvatar(Response.args[0])
                .then( () => {
                    Response.prepareEmbedResponse({
                        title: "Success",
                        description: "Successfully changed my av :D"
                    })
                    Response.sendEmbedResponse();
                })
                .catch( e => {
                    Response.prepareEmbedResponse({
                        title: "Error",
                        description: "Failed changing my av: \n" + e.message
                    })
                    Response.sendEmbedResponse();
                });
            }
        }else if( command_new_name_names.includes( Response.command ) ){
            if( Response.nArgs > 0){
                bot.user.setUsername( Response.args.slice( 0, Response.nArgs ).join(" "))
                .then( () => {
                    Response.prepareEmbedResponse({
                        title: "Success",
                        description: "Successfully changed my name :D"
                    })
                    Response.sendEmbedResponse();
                })
                .catch( e => {
                    Response.prepareEmbedResponse({
                        title: "Error",
                        description: "Failed changing my name: \n" + e.message
                    })
                    Response.sendEmbedResponse();
                });
            }
        }else if( command_new_activity_names.includes( Response.command ) ){
            if( Response.nArgs > 0){
                try{
                    bot.user.setActivity({
                        type: Response.args[0],
                        url: (Response.nArgs > 1) ? Response.args[1] : "",
                        name: ( Response.nArgs > 2) ? Response.args[2] : "Nothing."
                    })
                    Response.prepareEmbedResponse({
                        title: "Success",
                        description: "Successfully changed my activity :D"
                    })
                    Response.sendEmbedResponse();
                }catch( e ){
                    Response.prepareEmbedResponse({
                        title: "Error",
                        description: "Failed changing my activity: \n" + e.message
                    })
                    Response.sendEmbedResponse();
                };
            }
        } else if( command_new_status_names.includes( Response.command ) ){
            if( Response.nArgs > 0){
                bot.user.setStatus( Response.args[0] )
                Response.prepareEmbedResponse({
                    title: "Done",
                    description: "Check my new status!"
                })
                Response.sendEmbedResponse();
            }
        }


    });

    return info;
}
module.exports = config;