const timeBetweenMessages = 5000; //ms
const timeBetweenVIPMessages = 60000 //ms
const timePunishment = 30000; //ms
const maxMessagesForMute = 5;

const { privateId, subAdminsIds } = require("./../config/config");

class MutesManager {
    constructor(){
        this.mutes = {};
        this.users = {};
    }
    allowIncomingMessage = ( user ) => {
        const id = user.id;
        if( this.mutes[id] ) return false;
        //if( id === privateId) return true;
        if( this.users[id] ){
            const nMessages = this.users [id] [0];
            if( nMessages + 1 == maxMessagesForMute){
                this.mutes[id] = true;
                setTimeout((ID) => {
                    this.mutes[ ID ] = null;
                    this.users[ ID ] = null
                }, timePunishment , id );
            }
            clearTimeout( this.users [id] [1] );
            this.users[ id ] [0] += 1;
            this.users[ id ] [1] = setTimeout( (ID) => {
                this.users[ id ] = null;
            }, timeBetweenMessages , id);
        }else{
			this.users[ id ] = [1, setTimeout( (ID) => {
				this.users[ID] = null;
			},timeBetweenMessages, id)];
        }
        return true;
    }

}
module.exports = MutesManager;