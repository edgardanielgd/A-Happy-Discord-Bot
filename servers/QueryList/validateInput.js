const verifyIp = require("./../../utilities/validateIpFormat");

const verify = ( argument ) => {
    const resultArray = [];
    const array = argument.split(",");
    for(const element of array){ 
        const ipArgs = element.split(":");
        if( ipArgs.length != 2) return {
            error: "Bad ip address"
        }
        const ip = ipArgs[0];
        const valResult = verifyIp( ip );
        if( valResult.error){
            return{
                error: valResult.message
            }
        }
        const port = parseInt( ipArgs[1] );
        if( !port || isNaN(port) || port <= 0 || port >= 65536){
            return {
                error: "Bad port"
            }
        }
        resultArray.push( [ip, port] );
    }
    return {
        data: resultArray
    }
}

module.exports = verify;