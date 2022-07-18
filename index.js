const Discord= require('discord.js');
const config = require("./config/config");
const fun = require("./fun");
const servers = require("./servers");
const logger = require("winston");
const eventsHandler = require("./events");
const playersDatabase = require("./IpsDatabase");
const ipReputation = require("./IpsReputation");
const adminCommands = require("./administration");
const announceHostLinks = require("./utilities/announceHostLink");
const security = require("./security/deafen");
const info = require("./info");
const log = require("./logs");
const MaintenanceLogger = require("./logs/DM_maintenance");
const SlashCommandsConstructor = require("./slashcommands");

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console,{colorize:true});
logger.level='debug';

const slashCommandsConstructor = new SlashCommandsConstructor();

const bot=new Discord.Client({
    intents: ["GUILDS",
             "GUILD_MESSAGES",
             "GUILD_MESSAGE_REACTIONS",
             "GUILD_EMOJIS_AND_STICKERS",
             "DIRECT_MESSAGES",
             "GUILD_VOICE_STATES"
             ],
    partials: ["CHANNEL"]
  });

bot.on("ready", async () => {
    bot.user.setActivity("Halo CE and Halo PC servers stats", {
      type: "WATCHING"
    });
    MaintenanceLogger( bot, "`Listening`");

    const event = eventsHandler(bot, new security());

    const commands_info = [];

    announceHostLinks(event);

    commands_info.push( fun(event, slashCommandsConstructor) );
    commands_info.push( servers(event, slashCommandsConstructor) );

    const players_db = await playersDatabase(event);
    if( ! players_db.error ){
      commands_info.push( players_db );
    }

    commands_info.push( ipReputation(event) );
    commands_info.push( adminCommands(event) );

    info(event, commands_info, slashCommandsConstructor);
    log( event, bot);

    slashCommandsConstructor.registerCommands( bot );
});


bot.login(config.token);





