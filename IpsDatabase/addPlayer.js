const { databaseName, playersCollectionName } = require("./config.json");
const { validateInsertion } = require("./validateInput");
const checkAuth = require( "./checkAuth");

const command_names = [
    "add",
    "addPlayer",
    "insert",
    "insertPlayer",
    "append",
    "appendPlayer"
];

const info = {
    commands_aliases: [
        { "Add players": command_names }
    ],
    information: "Add players to database",
    emoji: "🌐"
}

const insertPlayer = (mongoclient, args) => {

    const ip = args[0].replace(/[^.\d]/g,"");
    const name = args[1];
    const server = parseInt( args[2] );
    const description = (args.length > 3) ? 
        args.slice(3, args.length).join(" ") : "";
    
    const db = mongoclient.db(databaseName);
    const collection = db.collection(playersCollectionName);

    const addData = () => {
        return new Promise( async ( addResolve, addReject ) => {
            collection.insertOne({
                ip: ip,
                name: name,
                servers: [ server ],
                description: description
            })
            .then( result => {
                addResolve({
                    success: "Added successfully"
                })
            })
            .catch( e => {
                addResolve({
                    error: "Couldnt add data"
                })
            })
        })
    }

    return new Promise( async (resolve, reject) => {
        collection.findOneAndUpdate(
            {
                ip : {
                    $eq: ip
                    },
                name: {
                    $regex: ".*" + name + ".*",
                    $options: "i"
                }
            },
            {
                $addToSet: {
                    servers: server 
                }
            }
        )
        .then( result => {
            if( result ){
                if( result.value ){
                    if( result.lastErrorObject && result.lastErrorObject.updatedExisting){
                        resolve({
                            success: "Updated a player's servers info"
                        })
                    }else{
                        resolve({
                            error: "Player already exists"
                        })
                    }
                }else{
                    //Needs to be added
                    addData()
                    .then( addResult => {
                        resolve( addResult );
                    })
                }
            }else{
                resolve({
                    error: "Couldnt find any correct result of operation"
                })
            }
        })
        .catch( e => {
            resolve({
                error: "Could not find existing"
            });
        })
    });
}

const config = (event, mongoclient) => {
    event.on( "messageCommand", async(bot, Response, msg) => {
        if(command_names.includes( Response.command )){
            if( ! checkAuth( msg.channel )) return;
            const validation = validateInsertion(Response.args)
            if( validation.valid ){
                insertPlayer(mongoclient, Response.args)
                .then( msg => {
                    if( msg.error ){
                        Response.prepareEmbedResponse({
                            title: "Something went wrong..",
                            description: msg.error
                        });
                        Response.sendEmbedResponse();
                    }else if( msg.success ){
                        Response.prepareEmbedResponse({
                            title: "Success",
                            description: msg.success
                        });
                        Response.sendEmbedResponse();
                    }
                })
                .catch( e => {
                    Response.prepareEmbedResponse({
                        title: "Error",
                        description: "Unknown error"
                    });
                    Response.sendEmbedResponse();
                });
            }else{
                Response.prepareEmbedResponse({
                    title: "Something went wrong..",
                    description: validation.error
                });
                Response.sendEmbedResponse();
            }
        }
    });

    return info;
}
module.exports = config;