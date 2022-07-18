const checkAdmin = require("./checkAdministrator");

const command_list_servers_names = [
    "serverslist",
    "serverlist",
    "currentServers"
];
const command_exit_servers_names = [
    "leaveserver",
    "leaveserveradmin"
];
const info = {
    commands_aliases: [
        { "List current servers": command_list_servers_names },
        { "Exit a server": command_exit_servers_names }
    ],
    information: "Query and delete servers where im in",
    emoji: "🏠"
}

const config = (event) => {
    event.on("messageCommand", async (bot, Response, msg) => {

        if( ! checkAdmin( msg )) return;
            if( command_list_servers_names.includes( Response.command )){
                let string="";
                let count=0;
                bot.guilds.cache.forEach(guild => {
                    string += ( (++count) + `. ${guild.name} | ${guild.id}` ) + "\n";
                });
                Response.prepareEmbedResponse({
                    title: "Current servers:",
                    description: string
                });
                Response.sendEmbedResponse();
            }else if( command_exit_servers_names.includes( Response.command) ){
                if( Response.nArgs > 0){
                    let guild = await bot.guilds.fetch( Response.args[0])
                        .then( guild => {
                            guild.leave()
                                .then( leftGuild => {
                                    Response.prepareEmbedResponse({
                                        title: "Left guild " + leftGuild.id,
                                        description: "Name: " + leftGuild.name
                                    });
                                    Response.sendEmbedResponse();
                                })
                                .catch( e => {
                                    Response.prepareEmbedResponse({
                                        title: "Error",
                                        description: "Couldnt leave guild"
                                    });
                                    Response.sendEmbedResponse();
                                })
                        })
                        .catch( e => {
                            Response.prepareEmbedResponse({
                                title: "Error",
                                description: "Couldnt leave guild"
                            });
                            Response.sendEmbedResponse();
                        })
                }
            }
        

    });

    return info;
}
module.exports = config;