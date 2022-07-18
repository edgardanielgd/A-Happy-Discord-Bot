const verifyIp = require("./../../utilities/validateIpFormat");
const checker = ( ip, port) => {
    try{
        port=parseInt(port);
        if(!port || isNaN(port))
            return {
                error: "Port is not a number",
                message: 
                "Could you please try again with a valid ip?...\nWhat about a server offline?" 
            }
        }catch(e){
            return {
                error: "Port is not a number",
                message: 
                    "Could you please try again with a valid ip?...\nWhat about a server offline?" 
            }
        }
    if(port<=0 || port>=65536)
        return {
            error: "Port is not correct",
            message: 
            "Could you please try again with a valid ip?...\nWhat about a server offline?" 
        }
    const { error, message } = verifyIp( ip );
    if( error ){
        return {
            error: error,
            message: message
        }
    }
    return {
        success: true,
        port: port
    }
}
module.exports = checker;