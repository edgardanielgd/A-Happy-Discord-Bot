const { dbUser, dbPassword } = require("./../config/config");
const { databaseName } = require("./config.json");
const mongoClient = require("mongodb").MongoClient;
const configAdd = require("./addPlayer");
const configSearch = require("./searchPlayer");

const connectionURL = 
`mongodb+srv://${dbUser}:${dbPassword}@cluster0.stklp.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const config = ( event ) => {
    return new Promise( (resolve, reject ) => {
        mongoClient.connect(
            connectionURL,
            {useNewUrlParser: true, useUnifiedTopology: true},
            ( err, client) => {
                if( err ){
                    console.log( err );
                    resolve({
                        error: err.message
                    });
                }
                else{
                    let infoExport = {
                        id: "playersDatabase",
                        name: "Players database commands",
                        components: [],
                        emoji: "📔"
                    }
                    infoExport.components.push( configAdd( event, client) );
                    infoExport.components.push( configSearch( event, client) );

                    resolve( infoExport );
                }
            }
        )
    });
}
module.exports = config;

