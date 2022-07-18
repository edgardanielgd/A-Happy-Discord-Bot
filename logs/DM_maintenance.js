const { sendMessage } = require("./../utilities/responseManager");
const { privateId } = require("./../config/config");

const sendDm = async ( bot, msg ) => {
    const MaintenanceUser = await bot.users.fetch( privateId );
    if( MaintenanceUser ){
        try{
            MaintenanceUser.send( msg );
        }catch(e){}
    }
}
module.exports = sendDm;