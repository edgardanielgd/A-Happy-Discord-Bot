const default_color = "#fffdfc";
const Discord = require("discord.js");
const { prefix } = require("./../config/config");
const { sendMessage, editMessage, replyMessageOrInteraction } = require("./responseManager");

class CustomMessage{
    constructor( interactionOrMessage, isCmdInteraction){
        
        this.target = interactionOrMessage;
        if( isCmdInteraction ){
            this.target = {
                author : interactionOrMessage.user,
                channel : interactionOrMessage.channel,
                member : interactionOrMessage.member
            };
            this.interaction = interactionOrMessage;
        }

        this.isCmdInteraction = isCmdInteraction;

        if(!this.target){
            this.isValid = false;
            return;
        }
        this.dm = false;

        if(this.target.channel.type == "DM" || this.target.channel.type == "GROUP_DM"){
            this.dm = true;
        }

        if( this.isCmdInteraction ) return;

        let strMessage = this.target.toString();
        if(!strMessage || strMessage.length == 0 || strMessage.length < prefix.length){
            this.isValid = false;
            return;
        }

        if(strMessage.substring(0,prefix.length) == prefix){
            let arrArgs = strMessage.split(/\s/g);
            if(arrArgs.length > 0 && arrArgs[0].length > 1){
                this.isValid = true;
                this.command = arrArgs[0].substring(1, arrArgs[0].length).toLowerCase(); //Only command
                if(arrArgs.length > 1){
                    this.args = arrArgs.slice(1,arrArgs.length);
                }
                this.nArgs = (this.args) ? this.args.length : 0;
            }else{
                this.isValid = false;
                return;
            }
        }else{
            this.isValid = false;
            return;
        }

    }

    prepareEmbedResponse = (options) => {
        if( !options.color ){
            if( !this.dm && this.target)
                options.color = this.target.member.displayColor;
            else 
                options.color = default_color;
        }
        if( !options.footer && this.target ){
            options.footer = {
                text: "Requested by: " + this.target.author.username + "#" +
                    this.target.author.discriminator,
                iconURL: this.target.author.avatarURL()
            }
        }
        this.embed = new Discord.MessageEmbed( options );
        return this.embed;
    }
    sendEmbedResponse = () => {
        return new Promise( async ( resolve, reject ) => {
            if( this.embed )
                if( this.isCmdInteraction ){
                    this.msgSent = await replyMessageOrInteraction( this.interaction, {
                        embeds: [ this.embed ],
                        fetchReply: true
                    } );
                }else{
                    this.msgSent = await sendMessage( this.target.channel, {
                        embeds: [ this.embed ]
                    });
                }
                
            resolve( this.msgSent );
        });
        
    }
    editEmbedResponse = () => {
        return new Promise( async ( resolve, reject ) => {
            if( this.targetSent && this.embed) 
                this.msgSent = await editMessage( this.targetSent, {
                    embeds: [ this.embed ]
                });
            resolve( this.msgSent );
        });
    }
    
}

module.exports = CustomMessage;