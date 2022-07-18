const queryManager = require("./Query");
const queryListManager = require("./QueryList");

config = (event, scc) => {
    let infoExport = {
        id: "haloServers",
        name: "Halo servers commands",
        components: [],
        emoji: "🖥️"
    }
    infoExport.components.push( queryManager( event, scc ) );
    infoExport.components.push( queryListManager( event, scc ) );
    return infoExport;
}
module.exports = config