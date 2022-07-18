require("dotenv").config();
const prefix = "$";

const config = {
    token: process.env.Token,
    URL: process.env.URL,
    ipQualityAuth: process.env.ipQualityAuth,
    vpnapi: process.env.vpnapi,
    NatyPass: process.env.NatyPass,
    prefix : prefix,
    privateId : process.env.meId,
    natyId : process.env.natyId,

    dbUser: process.env.dbUser,
    dbPassword: process.env.dbPassword,

    RapidAPIHost: process.env.RapidAPIHost,
    RapidAPIKey: process.env.RapidAPIKey,

    subAdminsIds : (( data ) => {
        try{
            return JSON.parse( data );
        }catch( e ){
            return []
        }
    }) (process.env.subAdminsIds),

    announceURL: false

}

module.exports = config;