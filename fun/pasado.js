

const command_names = [
    "charly",
    "elaya",
    "snow",
    "axe",
    "foch",
    "bull",
    "pepo",
    "leyen",
    "lastk"
];

const info = {
    commands_aliases: [
        { "Charly command" : command_names }
    ],
    information: "Not sure how it went here at all..",
    emoji: "👾"
}

const config = (event) => {
    event.on("messageCommand", (bot, Response, msg) => {
        if(command_names.includes( Response.command )){
            Response.prepareEmbedResponse({
                title: ":v",
                description: "Pasadisimo(a) de burguer diria "+ Response.command,
                footer: {
                    text: "Requested by a guy who is not at work, im sure",
                    iconURL: msg.author.displayAvatarURL({
                        dynamic: true,
                        format: "png"
                    })
                }
            });
            Response.sendEmbedResponse();
        }
    });

    return info;
}
module.exports = config;