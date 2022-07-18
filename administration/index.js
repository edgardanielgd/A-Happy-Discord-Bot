const botAppearance = require("./botAppearance ");
const botServers = require("./botServers");
const config = ( event ) => {
    let infoExport = {
        id: "Administration",
        name: "Administrator commands",
        components: [],
        emoji: "🛠️"
    }
    infoExport.components.push( botAppearance( event ) );
    infoExport.components.push( botServers( event ) );

    return infoExport;
}
module.exports = config;