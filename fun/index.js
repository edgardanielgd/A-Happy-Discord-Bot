const funnyNicks = require("./funnyNicks");
const simp = require("./simp");
const pasado = require("./pasado");
const naty = require("./Naty");
const sendMessages = require("./sendMessage");
const sendEmbedMessages = require("./sendMessageEmbed");
const greetings = require("./greetings");
const randomReact = require("./randomReact");
const modalDesc = require("./modalDescription");

config = (event, ssc) => {
    let infoExport = {
        id: "Fun",
        name: "Fun commands",
        components: [],
        emoji: "🤡"
    }
    
    infoExport.components.push( greetings(event) );
    infoExport.components.push( pasado(event) );
    infoExport.components.push( simp(event, ssc) );
    infoExport.components.push( sendMessages(event) );
    infoExport.components.push( sendEmbedMessages(event) );
    infoExport.components.push( modalDesc(event) );

    funnyNicks(event);
    naty(event);
    randomReact(event);

    return infoExport;
}
module.exports = config