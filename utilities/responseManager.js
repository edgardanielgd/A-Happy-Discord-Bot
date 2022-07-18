const Discord = require("discord.js");
const textTypes = [ "GUILD_TEXT", "DM", "GROUP_DM", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD, GUILD_NEWS"];

const checkScopesSendEdit = ( channel ) => {
    if( channel  && 
        textTypes.includes(channel.type)
    ){
        if( channel.guild){
            if( channel.viewable && channel.permissionsFor( channel.guild.me).has( "SEND_MESSAGES")){
                if (( channel.type == "GUILD_PUBLIC_THREAD" || channel.type == "GUILD_PRIVATE_THREAD")){
                    if(channel.permissionsFor( channel.guild.me).has( "SEND_MESSAGES_IN_THREADS"))
                        return true;
                    return false;
                }
                return true;
            }
            return false;
        }
        return true;
    }
    return false;
}

const checkScopesReact = ( channel ) => {
    if( channel && textTypes.includes(channel.type)){
        if( channel.guild ){
            if( channel.viewable ){
                if( channel.permissionsFor( channel.guild.me ).has( "ADD_REACTIONS" )){
                    return true;
                }
                return false;
            }  
            return false;
        }
        return true;
    }
    return false;
}
const pkgManager = {
    sendMessage : (channel, options) => {
        return new Promise ( (resolve, reject) => {
            if( !channel ) resolve( null );
            const allowed = checkScopesSendEdit( channel );
            if( allowed ){
                channel.send( options )
                .then( msg  => {
                    resolve( msg );
                })
                .catch( e => {
                    console.log( e );
                    resolve( null );
                })
            }else resolve( null );
            
        });
    },
    editMessage : ( msg, options) => {
        return new Promise ( (resolve, reject) => {
            if( !msg ) resolve( null );
            if( msg.channel ){
                //If it is not a DM
                const allowed = checkScopesSendEdit( msg.channel );
                if( allowed ){
                    msg.edit( options )
                    .then( msg => {
                        resolve( msg );
                    })
                    .catch( e => {
                        console.log( e );
                        resolve( null );
                    })
                }else resolve( null );
            }else resolve( null );
        });
    },
    replyMessageOrInteraction : ( target, options ) => {
        return new Promise ( (resolve, reject) => {
            if( !target ) resolve( null );
            if( target.channel ){
                //If it is not a DM
                const allowed = checkScopesSendEdit( target.channel );
                if( allowed ){
                    target.reply( options )
                    .then( target => {
                        resolve( target );
                    })
                    .catch( e => {
                        console.log( e );
                        resolve( null );
                    })
                }else resolve( null );
            }else resolve( null );
        });
    },
    addReaction: ( msg, emoji) => {
        return new Promise( ( resolve, reject ) => {
            if( !msg ) resolve( null );
            if( msg.channel ){
                const allowed = checkScopesReact( msg.channel );
                if( allowed ){
                    msg.react( emoji )
                    .then( msgReaction => resolve( msgReaction ))
                    .catch( e => {
                        console.log(e);
                        resolve( null );
                    })
                }else resolve( null );
            }else resolve( null );
        });
    }


}



module.exports = pkgManager;