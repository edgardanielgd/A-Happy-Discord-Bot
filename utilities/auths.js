const config = require("./../config/config");

const checkId = ( msg ) => {
    if(msg.author.id === config.privateId) return true;
    return false;
}
module.exports = {
    checkId: checkId
} 
