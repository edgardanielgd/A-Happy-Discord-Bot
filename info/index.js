const credits = require("./credits");
const help = require("./help");

config = (event, commands_info, scc) => {
    let infoExport = {
        id: "Info",
        name: "Info commands",
        components: [],
        emoji: "ℹ️"
    }
    infoExport.components.push( credits( event ) );

    help( event, commands_info, infoExport, scc);
    
}
module.exports = config