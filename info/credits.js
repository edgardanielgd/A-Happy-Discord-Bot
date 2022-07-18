const command_names = [
    "credits",
    "whois",
    "whoamme",
    "whoareyou",
    "describe"
];
const info = {
    commands_aliases: [
        { "Credits command": command_names }
    ],
    information: "See who made this bot possible",
    emoji: "🧑‍🏭"
}

const config = (event) => {
    event.on("messageCommand", async (bot, Response, msg) => {
        if(command_names.includes( Response.command )){
            Response.prepareEmbedResponse({
                title: "Huge thanks!",
                description: "Based on: BK-Translator Bot (By Este)\n"+
                "Thanks to: hce.halomaps.org\n"+
                "Ips info by: ipqualityscore.com and vpnapi.io\n"+
                "Countries info by: country.io\nDeveloped by: {BK}Fochman\n\n"+
                "And thanks to {BK}Charly for some help with hosting this bot :v",
                author: {
                    text: "Good morning/afternoon/night"
                },
            });
            Response.sendEmbedResponse();
        }
    });

    return info;
}
module.exports = config;