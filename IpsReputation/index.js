const checkReputation_opt1 = require("./checkReputation_opt1");
const checkReputation_opt2 = require("./checkReputation_opt2");

const config = ( event ) => {
    let infoExport = {
        id: "ipsCheck",
        name: "Ip reputation commands",
        components: [],
        emoji: "⚠️"
    }
    infoExport.components.push( checkReputation_opt1 ( event ) );
    infoExport.components.push( checkReputation_opt2 ( event ) );

    return infoExport;
}
module.exports = config;