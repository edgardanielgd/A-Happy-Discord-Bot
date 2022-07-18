const { URL, announceURL } = require("./../config/config");
const config = (event) => {
    event.on("messageCommand", async (bot, Response, msg) => {
        if( announceURL ){
            Response.prepareEmbedResponse({
                title: "Click here if im not online!!\nPresiona aqui si no estoy conectado!!",
                url: URL,
                footer: {
                    text: "Hello"
                }
            });
            Response.sendEmbedResponse();
        }
    });
}
module.exports = config;