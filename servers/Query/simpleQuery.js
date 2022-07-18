const { getMap } = require("../../utilities/mapDirs");
const decoder = require("./decodeQuery");
const validator = require("./validateQuery");
const sender = require("./../sendQuery");
const rowConfig = require("./configureEmbedRow");
const { editMessage } = require("./../../utilities/responseManager");
const { privateId, subAdminsIds} = require("./../../config/config");
const MaintenanceSender = require("./../../logs/DM_maintenance");
const mg = require("./../../utilities/messageGenerator");

const command_names = [
    "on",
    "sv",
    "query",
    "server",
    "info"
];

const specialPorts_command_names = [
    "changespecialport",
    "setspecialport",
    "specialports"
];

const slashCommandData = [
    {
        name: "on",
        description: "Query a server game state",
        type: "CHAT_INPUT",
        options: [
            { 
                name: "server",
                type : "STRING",
                description : "The server port (or ip:port or ip) you want to query",
                required: true
            },
            { 
                name: "port",
                type : "NUMBER",
                description : "The server port if you user ip port separated format",
                required: false
            },
        ]
    },
    {
        name: "csp",
        description: "Change special query ports (only subadmins)",
        type: "CHAT_INPUT",
        options: [
            {
                name: "alias",
                type : "STRING",
                description : "Server alias (usually a port number)",
                required: true
            },
            { 
                name: "targetip",
                type : "STRING",
                description : "Target server's ip",
                required: true
            },
            { 
                name: "targetport",
                type : "NUMBER",
                description : "Target server's port",
                required: true
            },
        ]
    }
];

const info = {
    commands_aliases: [
        { "Simple query commands": command_names },
        { "Special ports commands": specialPorts_command_names },
    ],
    information: "Query and config Halo CE and PC servers",
    emoji: "🤖"
}


const specialPorts={
	"2313" : ["45.79.216.94",2302]
}
const defaultIp = "45.79.216.94";

const sendStats = async ( Response, ip, port) => {
    const result = validator( ip, port);
    if( result.error ){
        Response.prepareEmbedResponse({
            title: "Error...",
            description: result.description,
            author: {
                name: result.error
            }
        });
        Response.sendEmbedResponse();
        return;
    }else if( result.success ){
        port = result.port;
        let querySender = new sender( ip, port);
        let received = await querySender.send();

        if(received.error){
            Response.prepareEmbedResponse({
                title: "Error...",
                description: received.error + "\n" +
                    "Awaited time: " + received.time + " ms",
                author: {
                    name: received.type
                },
                footer: {
                    text: ip + ":" + port
                }
            });
            await Response.sendEmbedResponse();
            if( Response.msgSent )
                rowConfig.update( Response.msgSent, true );
        }else if( received.data ){
            let decoded = decoder( received.data );
            Response.prepareEmbedResponse({
                title: "Checking states of "+ip+":"+port,
                description: decoded.description + "\n" +
                    "`Ping: `" + received.ping + " ms",
                thumbnail: {
                    url: getMap( decoded.map )
                }
            });
            await Response.sendEmbedResponse();
            if( Response.msgSent )
                rowConfig.update( Response.msgSent, false );
        }
        
    }
}

const editStats = async ( msg, retrying, user ) => {
    // Message still have to exist
    
    const { ip, port, error, embed } = getDataFromEmbed( msg, retrying );

    if( error ){
        console.log( error );
        return;
    }
    if ( ! (await editMessage(msg, {
        components: []
    }) )) return;
    let querySender = new sender( ip, port);
    let received = await querySender.send();

    if(received.error){
        embed.setTitle( "Error..." );
        embed.setDescription( received.error  + "\n" +
        "Awaited time: " + received.time + " ms" );
        embed.setAuthor( {
            name: received.type
        });
        embed.setFooter( {
            text: ip + ":" + port
        })
        retrying = true;
    }else if( received.data ){
        let decoded = decoder( received.data );
        embed.setTitle( "Checking states of "+ip+":"+port );
        embed.setDescription( decoded.description + "\n" +
        "`Ping: `" + received.ping + " ms" );
        embed.setThumbnail(
            getMap( decoded.map )
            );
        embed.setAuthor( { 
            name: ""
        } ); 
        retrying = false;
    }

    if(embed){
        if( ! ( await editMessage(msg, {
            content: "Updated by: " + user.username + "#" + user.discriminator,
            embeds: [embed]
        }) )) return;
        rowConfig.update( msg , retrying );
    }    
}

const getDataFromEmbed = ( msg , retrying) => {
    let ip,port = null;
    let embeds = msg.embeds;
    if( embeds && embeds.length > 0){
        let embed = embeds[0];
        if( retrying ){
            try{
                let descr = embed.footer;
                if( ! descr ) return { error: "No footer found" }
                descr = descr.text;
                let sepAddress = descr.split(":");
                ip = sepAddress[0];
                port = parseInt(sepAddress[1]);
                if(isNaN(port))
                    return {
                        error: "Wrong port format"
                    }
            }catch( e ) {
                return {
                    error: e
                }
            }
        }else{
            try{
                let title = embed.title;
                let address = title.split(" ")[3];
                let sepAddress = address.split(":");
                ip = sepAddress[0];
                port = parseInt(sepAddress[1]);
                if(isNaN(port))
                    return {
                        error: "Wrong port format"
                    }
            }catch( e ){
                return {
                    error: e
                }
            }
        }
        return {
            ip, port, embed
        }
    }
}

const config = (event, scc) => {

    scc.addCommand( slashCommandData );

    event.on("messageCommand", async (bot, Response, msg) => {
        try{
            if(command_names.includes( Response.command )){
                if( Response.nArgs > 1){
                    sendStats( Response, Response.args[0], Response.args[1]);
                }else if( Response.nArgs > 0 ){

                    let ip_port = Response.args[0].split(":");
                    let data = specialPorts[ Response.args[0].toLowerCase() ];

                    if(ip_port && ip_port.length == 2){
                        sendStats( Response, ip_port[0], ip_port[1]);
                    }else if( data ){
                        sendStats( Response, data[0], data[1]);
                    }else{
                        sendStats( Response, defaultIp, Response.args[0]);
                    }
                }
            }else if(specialPorts_command_names.includes( Response.command )){
                if( msg.author.id == privateId || subAdminsIds.includes( msg.author.id )){
                    if( Response.nArgs > 2){
                        const args = Response.args;
                        const result = validator( args[1], args[2]);
                        if( result.error ){
                            Response.prepareEmbedResponse({
                                title: "Error...",
                                description: result.description,
                                author: {
                                    name: result.error
                                }
                            });
                            Response.sendEmbedResponse();
                        }else if( result.success ){
                            port = result.port;
                            specialPorts[ args[0] ] = [ args[1], port ];
                            Response.prepareEmbedResponse({
                                title: "Success",
                                description: "Changed special port"
                            });
                            Response.sendEmbedResponse();
                        }
                        
                    }
                }else{
                    Response.prepareEmbedResponse({
                        title: "Auth required",
                        description: "You need to be a sub admin of this bot"
                    });
                    Response.sendEmbedResponse();
                }
                
            }
        }catch( e ){
            MaintenanceSender( bot, "Error: \n" + e);
        }
    });

    event.on("interactionSlashCommand", async( bot, interaction) => {
        if( interaction.commandName == "on" ){
            
            const Response = new mg( interaction, true);

            const server = interaction.options.getString("server");
            const optional_port = interaction.options.getNumber("port");
            
            if( optional_port ){
                sendStats( Response, server, optional_port);
            }else{
                let ip_port = server.split(":");
                let data = specialPorts[ server.toLowerCase() ];

                if(ip_port && ip_port.length == 2){
                    sendStats( Response, ip_port[0], ip_port[1]);
                }else if( data ){
                    sendStats( Response, data[0], data[1]);
                }else{
                    sendStats( Response, defaultIp, server);
                }
            }
        }else if( interaction.commandName == "csp" ){
            if( interaction.user.id == privateId || subAdminsIds.includes( interaction.user.id )){

                const Response = new mg( interaction, true);

                const aliasKey = interaction.options.getString( "alias" );
                const targetIp = interaction.options.getString( "targetip" );
                const targetPort = interaction.options.getNumber( "targetport" );

                if( aliasKey || targetIp || targetPort ){

                    const result = validator( targetIp, targetPort);
                    if( result.error ){
                        Response.prepareEmbedResponse({
                            title: "Error...",
                            description: result.description,
                            author: {
                                name: result.error
                            }
                        });
                        Response.sendEmbedResponse();
                    }else if( result.success ){
                        port = result.port;
                        specialPorts[ aliasKey ] = [ targetIp, port ];
                        Response.prepareEmbedResponse({
                            title: "Success",
                            description: "Changed special port"
                        });
                        Response.sendEmbedResponse();
                    }
                    
                }
            }else{
                Response.prepareEmbedResponse({
                    title: "Auth required",
                    description: "You need to be a sub admin of this bot"
                });
                Response.sendEmbedResponse();
            }
        }
    });

    event.on("interactionButton", async (bot, interaction) => {
        try{
            if(interaction.customId === "Update"){
                interaction.deferUpdate();
                editStats( interaction.message , false, interaction.user);
            }else if(interaction.customId === "Retry"){
                interaction.deferUpdate();
                editStats( interaction.message , true, interaction.user);
            }
        }catch(e){
            MaintenanceSender( bot, "Error: \n" + e);
        }
    });

    return info;
}
module.exports = config;