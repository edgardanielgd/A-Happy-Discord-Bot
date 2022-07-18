const { allowedChannels } = require("./config.json");

const checkAuth = ( channel ) => {
    if( channel && allowedChannels && allowedChannels.includes( channel.id ))
        return true
    return false
}
module.exports = checkAuth;