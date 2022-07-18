const { databaseName, playersCollectionName, itemsPerPage } = require("./config.json");
const { validateQuery } = require("./validateInput");
const { sendMessage } = require("./../utilities/responseManager");
const playersListManager = require("./managePlayersList");
const Discord = require("discord.js");
const checkAuth = require( "./checkAuth");

const command_names = [
    "search",
    "searchPlayer"
];

const info = {
    commands_aliases: [
        { "Search players": command_names }
    ],
    information: "Search a player on database",
    emoji: "❓"
}

const searchFields = {
    "all": -1,
    "ip": 0,
    "name": 1,
    "server": 2,
    "description": 3
}

const searchPlayers = (mongoclient, type, value, page) => {
    const db = mongoclient.db(databaseName);
    const collection = db.collection(playersCollectionName);
    let query = {}
    switch( type ){
        case 0: {
            query = {
                ip: {
                    $regex: "^"+value + ".*",
                    $options: "i"
                }
            }
            break;
        }
        case 1: {
            query = {
                name: {
                    $regex: ".*" + value + ".*",
                    $options: "i"
                }
            }
            break;
        }
        case 2: {
            query = {
                $expr: {
                    $in: [
                        value, "$servers"
                    ]
                }
            }
            break;
        }
        case 3: {
            query = {
                description: {
                    $regex: ".*" + value + ".*",
                    $options: "i"
                }
            }
            break;
        }
    }

    return new Promise( async ( resolve, reject ) => {

        let resultArr = [];
        let foundAny = false;

        collection.aggregate([
            { $match: query},
            { $sort: {
                name: 1
            } },
            { $skip : (page) ? ( (page - 1) * itemsPerPage ) : 0 },
            { $limit: itemsPerPage }
        ]).forEach( ( row ) => {
            if( ! foundAny ) foundAny = true;
            resultArr.push( row );
        }, ( err ) => {
            if( err ){
                console.log( err );
                resolve({
                    error: "Error while parsing results"
                });
                return;
            }
            if( foundAny ){
                resolve({
                    data: resultArr
                });
                return;
            }
            resolve({
                error: "No results found",
                notFound : true
            })
        })

    });
}

const config = (event, mongoclient) => {
    event.on( "messageCommand", async(bot, Response, msg) => {
        if(command_names.includes( Response.command )){
            if( ! checkAuth( msg.channel )) return;
            const { type, value, page, error} = validateQuery(Response.args, searchFields);
            if( ! error ){
                searchPlayers(mongoclient, type, value, page)
                .then( result => {
                    if( result.error ){
                        if( result.notFound )
                            Response.prepareEmbedResponse({
                                description: result.error
                            });
                        else
                            Response.prepareEmbedResponse({
                                title: "Something went wrong",
                                description: result.error
                            });
                        Response.sendEmbedResponse();
                    }else if( result.data ){
                        const manager = new playersListManager( result.data );
                        const actionRow = new Discord.MessageActionRow();
                        
                        Response.prepareEmbedResponse({
                            title: "I found this:",
                            description: manager.getPlayersAsString()
                        });

                        actionRow.addComponents( manager.getPlayersAsMenu() );
                        sendMessage( msg.channel, {
                            embeds: [ Response.embed ],
                            components: [ actionRow ]
                        });
                    }
                })
                .catch( e => {
                    console.log( e );
                    Response.prepareEmbedResponse({
                        title: "Error",
                        description: "Unknown error"
                    });
                    Response.sendEmbedResponse();
                });
            }else{
                Response.prepareEmbedResponse({
                    title: "Invalid query",
                    description: error
                });
                Response.sendEmbedResponse();
            }
        }
    });

    return info;
}
module.exports = config;