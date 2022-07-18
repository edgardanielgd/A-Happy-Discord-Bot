const configEnv = require("./../config/config");
const auths = require("./../utilities/auths");
const { sendMessage } = require("./../utilities/responseManager");

const command_names = [
    "felizdianaty",
    "happydaynataly",
    "happydaynaty"
];
const natyId = configEnv.natyId;
const changeInterval = 10000;

const setInfo = ( Response ) => {
    let color="#"+Math.floor(Math.random()*16777215).toString(16);
    Response.prepareEmbedResponse({
        tile: "Para la nena mas áspera que hay\nNi Marie Curie le gana",
        description: "Feliz dia mi Nataly!!!!!\nTe adoro con todo mi alma mi conejito\nTe regalo todo mi talento para que te sientas especial mi vida.",
        color: color
    });

    Response.editEmbedResponse();

    setInterval( () => {
        try{
            setInfo ( Response );
        }catch( e ){ 
            console.log(e);
            return;
         }
    }
    ,changeInterval)
}
const config = (event) => {
    event.on("messageCommand", async (bot, Response, msg) => {

        if( !auths.checkId( msg )) return;
        
        if(command_names.includes( Response.command )){
            sendMessage( msg.channel, {
                content: "<@" + natyId + ">"
            })
            setInfo( Response );
            Response.sendEmbedResponse();
        }
    });
}
module.exports = config;