const funnyNicksList = [
    "Stumpy","Whicker","Shadow","Howard","Wilshire","Darling",
   "Disco","Jack","The Bear","Sneak","The Big L","Whisp","Wheezy",
   "Crazy","Goat","Pirate","Saucy","Hambone","Butcher","Walla Walla",
   "Snake","Caboose","Sleepy","Killer","Stompy","Mopey","Dopey","Weasel",
   "Ghost","Dasher","Grumpy","Hollywood","Tooth","Noodle","King","Cupid","Prancer"
 ];
const guildsForFun = [
    "809795167489753098"
];
const changeInterval = 3600000;
const refreshOnInterval = true;

const changeNickname = (member) => {
    
    if(funnyNicksList.length > 0 && member.permissions.has("CHANGE_NICKNAME")){
        let id = Math.floor(Math.random()*funnyNicksList.length);
        member.setNickname(funnyNicksList[id])
        .then( (member) => {
            if(refreshOnInterval){
                setTimeout( () => {
                    changeNickname (member);
                }, changeInterval);
            }
        })
        .catch( (e) => {
            console.log(e);
        });
    }
}
config = (event) => {
    event.on("running", (bot) => {
        for( let guild of guildsForFun){
                let gldCurrent = bot.guilds.cache.get(guild);
                if(gldCurrent){
                    let member = gldCurrent.me;
                    changeNickname(member);
                }
            }
        });
}
module.exports = config;
