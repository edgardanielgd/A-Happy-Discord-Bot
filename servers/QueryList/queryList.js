const configList = require("./config.json");
const { privateId, subAdminsIds} = require("./../../config/config");
//const { checkExistence } = require("./../../utilities/messageExistence");
const decoder = require("./decodeListQuery");
const sender = require("./../sendQuery");
const verifyInput = require("./validateInput");
//const { sendMessage, editMessage } = require("./../../utilities/responseManager");
const rowConfig = require("./configureEmbedRow");
const { editMessage } = require("./../../utilities/responseManager");
const MaintenanceSender = require("./../../logs/DM_maintenance");
const mg = require("./../../utilities/messageGenerator");
const Discord = require("discord.js");

const command_names = [
    "list",
    "query_list",
    "querylist"
];

const command_config_names = [
    "config_servers_list",
    "configserverslist"
];

var servers = configList.DefaultServers;

const slashCommandData = [
    {
        name: "list",
        description: "Query a list of servers stats",
        type: "CHAT_INPUT"
    },
    {
        name: "csl",
        description: "Configure servers list command",
        type: "CHAT_INPUT",
        options: [
            {
                name: "rawserversdata",
                type : "STRING",
                description : "Raw String containing all servers in ip:port format separated by ,",
                required: true
            }
        ]
    }
];

const info = {
    commands_aliases: [
        { "Query list commands": command_names },
        { "Config list commands": command_config_names },
    ],
    information: "Query your favorite servers fastly",
    emoji: "🏃‍♂️"
}

const getServersListSimpleData = () => {
    return new Promise( async (resolve, reject) =>{
        let results = "```\n";
        const responseArray = [];
        let resultsCount = 0;

        const ServersMenu = new Discord.MessageSelectMenu();
        ServersMenu.setCustomId( "ServersListMenu" );

        for( const serverId in servers){
            const server = servers[serverId];
            const ip = server[ 0 ];
            const port = server[ 1 ];
            const connection = new sender( ip, port);
            connection.send().then( result => {
                responseArray[serverId] = result;
                if( ++resultsCount == servers.length){
                    //only runs once
                    for(const response of responseArray){
                        const resIp = response.ip;
                        const resPort = response.port;
                        results += resIp + ":" + resPort;
                        if( response.error ){
                            if( response.type == "Timeout error")
                                results += " Offline";
                            else
                                results += " Error";
                        }else if(response.data){
                            const [playersCount, playersMax] = decoder( response.data.toString() );
                            results += " " + playersCount + " / " + playersMax + " Ping: " + response.ping;
                        }
                        results += "\n";

                        // Adds option to menu

                        ServersMenu.addOptions({
                            label: resIp + ":" + resPort,
                            value: resIp + ":" + resPort
                        });
                    }
                    results += "```";
                    resolve([
                        results, ServersMenu
                    ]);
                    return;
                }
            });
            
        }
    });
}

const getDataFromEmbed = (msg) => {
    if( msg ){
        const embeds = msg.embeds;
        if( embeds && embeds.length > 0){
            const embed = embeds[0];
            if( embed )
                return { embed };
            else 
                return { error: "No embed found at 0" }
        }else{
            return { error: "no embeds found" };
        }
    }else{
        return { error: "empty message" };
    }
}

const editList = async ( msg, user ) => {
    // Message still have to exist
    
    const { embed, error } = getDataFromEmbed( msg );

    if( error ){
        console.log( error );
        return;
    }
    await rowConfig.prepareUpdate( msg ); 
    
    const description = (await getServersListSimpleData())[0];

    embed.setDescription( description );

    if(embed){
        if( ! ( await editMessage(msg, {
            content: "Updated by: " + user.username + "#" + user.discriminator,
            embeds: [embed]
        }) )) return;
        rowConfig.update( msg );
    }    
}

const customSimpleQueryGen = (address, interaction) => {
    const [ip, port] = address.split(":");

    const connection = new sender( ip, port);
    connection.send().then( async result => {

        let messageContent = ""
        if( result.error )
            messageContent = "Could not get server info";
        else if( result.data ){
            const [ minp, maxp, description ] = decoder( result.data.toString() );
            messageContent = description;
        }

        await interaction.reply({
            content: messageContent,
            ephemeral: true
        });

    });
}
const config = (event, scc) => {

    scc.addCommand( slashCommandData );

    event.on("messageCommand", async (bot, Response, msg) => {
        if(command_names.includes( Response.command )){

            //if( msg.author.id != privateId && ! subAdminsIds.includes( msg.author.id )) return;
            
            const serversData = await getServersListSimpleData();
            const description = serversData[0];
            const serversMenu = serversData[1];

            Response.prepareEmbedResponse({
                title: "Servers fast query results: ",
                description: description
            });
            await Response.sendEmbedResponse();
            if( Response.msgSent )
                rowConfig.update( Response.msgSent, serversMenu);

        }else if(command_config_names.includes( Response.command) ){

            if( msg.author.id != privateId ) return;

            if( Response.nArgs > 0){

                const array = verifyInput( Response.args[0] );

                if( array.error ){
                    Response.prepareEmbedResponse({
                        title: "Error",
                        description: array.error
                    });
                }else{
                    servers = array.data;
                    Response.prepareEmbedResponse({
                        title: "Success",
                        description: "Updated servers list"
                    });
                }
                Response.sendEmbedResponse();
            }
        }
    });

    event.on("interactionSlashCommand", async( bot, interaction) => {
        if( interaction.commandName == "list" ){
            
            const Response = new mg( interaction, true);

            const serversData = await getServersListSimpleData();
            const description = serversData[0];
            const serversMenu = serversData[1];

            Response.prepareEmbedResponse({
                title: "Servers fast query results: ",
                description: description
            });
            await Response.sendEmbedResponse();
            if( Response.msgSent )
                rowConfig.update( Response.msgSent, serversMenu);
        }else if( interaction.commandName == "csl" ){
            if( msg.author.id != privateId ) return;

            const data = interaction.options.getString( "rawserversdata" );

            if( data ){

                const array = verifyInput( data );

                if( array.error ){
                    Response.prepareEmbedResponse({
                        title: "Error",
                        description: array.error
                    });
                }else{
                    servers = array.data;
                    Response.prepareEmbedResponse({
                        title: "Success",
                        description: "Updated servers list"
                    });
                }
                Response.sendEmbedResponse();
            }
        }
    });

    event.on("interactionButton", async (bot, interaction) => {
        try{
            if(interaction.customId === "UpdateList"){
                interaction.deferUpdate();
                editList( interaction.message , interaction.user);
            }
        }catch(e){
            MaintenanceSender( bot, "Error: \n" + e);
        }
    });

    event.on("interactionSelectMenu", async( bot, interaction) => {
        try{
            if( interaction.customId === "ServersListMenu"){

                if(interaction.values && interaction.values.length > 0){
                    const serverInfo = interaction.values[0];

                    customSimpleQueryGen( serverInfo, interaction );
                }
            }
        }catch(e){
            MaintenanceSender( bot, "Error: \n" + e + "\n" + e.stack);
        }
        
    });
    return info;
}
module.exports = config;