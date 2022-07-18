const { privateId } = require("./../config/config");

const checkIsAdmin = ( msg ) => {
    if( msg && msg.author.id === privateId ) return true;
    return false;
}
module.exports = checkIsAdmin;