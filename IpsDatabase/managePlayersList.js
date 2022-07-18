const Discord = require("discord.js");

class PlayersListManager {
    constructor( data ){
        this.data = data;
        this.genPlayersData( this.data );
    }
    genPlayersData = () => {
        let ListString = "";
        let ListMenu = new Discord.MessageSelectMenu();
        ListMenu.setCustomId( "IpsList" );
        for( let i = 0; i < this.data.length; i ++){
            const player = this.data[ i ];
            
            ListMenu.addOptions({
                label: player.ip,
                description: (i + 1) + ". " + player.name + " " + player.description,
                value: (i + 1) + " " + player.ip
            });

            let playerString = 
                "`"+(i + 1)
                +". Name:` "+ player.name 
                +" `IP:` "+ player.ip 
                +" `Description:` "+ player.description
                +" `Servers:` " + ( player.servers ? player.servers.join(" | ") : "None");
            
                ListString += playerString + "\n";
        }
        this.dataAsString = ListString;
        this.dataAsMenu = ListMenu;
    }

    getPlayersAsString = () => { return this.dataAsString }
    getPlayersAsMenu = () => { return this.dataAsMenu }

}
module.exports = PlayersListManager;