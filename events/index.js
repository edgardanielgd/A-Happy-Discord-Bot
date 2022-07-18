const event = require("events");
const messages = require("./OnMessage");
const interactions = require("./OnInteraction");
const errors = require("./OnError");
const ready = require("./OnReady");

const config = ( bot, securityManager ) =>{
    
    const BotManagerEvent = new event();
    BotManagerEvent.setMaxListeners( 20 );

    messages( bot, BotManagerEvent, securityManager);
    interactions( bot, BotManagerEvent, securityManager);
    errors( bot, BotManagerEvent);
    ready( bot, BotManagerEvent);

    return BotManagerEvent;
}
module.exports = config;