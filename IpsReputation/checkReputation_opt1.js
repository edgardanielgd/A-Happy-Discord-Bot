const checkAuth = require( "./checkAuth");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const verifyIp = require("./../utilities/validateIpFormat");
const { ipQualityAuth } = require("./../config/config");
const countries = require("./../countries.json");
const { sendMessage } = require("./../utilities/responseManager");
const Discord = require("discord.js");

const command_names = [
    "checkip",
    "reputation",
    "ipquality",
    "ipscore",
    "ipqualityscore",
    "ipreputation",
];
const info = {
    commands_aliases: [
        { "Check reputation (first option)": command_names }
    ],
    information: "Check an ip reputation",
    emoji: "🕵️‍♂️"
}

const requestInfo = ( ip ) => {
    return new Promise( ( resolve, reject ) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET",
            "https://ipqualityscore.com/api/json/ip/"+ipQualityAuth
            +"/"+ip
            +"?strictness=0&allow_public_access_points=true&fast=true&lighter_penalties=true&mobile=true");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.onreadystatechange = () => {
            if(xhr.readyState==4){
                if( xhr.status == 200 && xhr.responseText){
                    let responseJson = {}
                    try{
                        responseJson = JSON.parse( xhr.responseText );
                    }catch( e ){
                        resolve({
                            error: e
                        })
                    }
                    resolve({
                        data: responseJson
                    })
                }else{ 
                    resolve({
                        error: xhr.response
                    })
                }
            }
        }
        xhr.addEventListener("error", ( e ) => {
            resolve({
                error: e
            })
        });
        xhr.send();
    })
}

const genResponseText = ( data ) => {
    let response = "```\n";
    if( data["success"] ){
        response+="Country name: " + countries[data["country_code"]]+"\n";
		response+="Region: " + data["region"]+"\n";
		response+="City: " + data["city"]+"\n";
		response+="ISP: " + data["ISP"]+"\n";
		response+="Timezone: " + data["timezone"]+"\n";
		response+="Host: " + data["host"]+"\n";
		response+="Proxy: " + data["proxy"]+"\n";
		response+="VPN: " + data["vpn"];
        response+="\n```";
        response+="\nFraud Score:\t";
        response+= data["fraud_score"]+"%\n";
        if( data["fraud_score"] )
            response+= genPrettyFraud( data["fraud_score"] )
    }else{
        response += data["message"] + "\n```";
    }
    return response;
}

const genPrettyFraud = (score) => {
  let text = "";
  for(let i = 0;i>=0 && i <= score-10 && i <= 90;i+=10){
    if(i < 30){
      text+="🟩";
    }else if(i < 60){
      text+="🟧";
    }else if(i < 90){
      text+="🟥";
    }else{
      text+="❌";
    }
  }
  return text;
}

const config = (event) => {
    event.on("messageCommand", async (bot, Response, msg) => {
        if(! checkAuth( msg.channel )) return;
        if(command_names.includes( Response.command )){
            if( Response.nArgs > 0){
                const args = Response.args;
                const { error } = verifyIp( args[0] );
                if( ! error ){
                    const result = await requestInfo( args[0].replace(/[^.\d]/g,"") );
                    if( result && result.data ){
                        const responseText = genResponseText( result.data );
                        Response.prepareEmbedResponse({
                            title: "I found this checking ip: " + args[0],
                            description: responseText,
                            author: {
                                name: "Checking ip"
                            }
                        })
                    }else{
                        Response.prepareEmbedResponse({
                            title: "Error..",
                            description: "Failed requesting data to api"
                        })
                    }
                }else{
                    Response.prepareEmbedResponse({
                        title: "Error..",
                        description: error
                    })
                }
            }else{
                Response.prepareEmbedResponse({
                    title: "Error..",
                    description: "Missing arguments"
                }) 
            }
            Response.sendEmbedResponse();
        }
    });

    event.on("interactionSelectMenu", async (bot, interaction) => {
        if( interaction.customId === "IpsList"){
            const values = interaction.values;
            if( values.length != 1) return;
            const value = values[0];
            const args = value.split(" ");
            if( args.length < 2) return;
            const ip = args[1];
            interaction.deferUpdate();
            const result = await requestInfo( ip.replace(/[^.\d]/g,"") );
            const content = 
                "Requested by: " + interaction.user.username + "#" + interaction.user.discriminator;

            if( result && result.data ){
                const responseText = genResponseText( result.data );

                const embed = new Discord.MessageEmbed({
                    title: "I found this checking ip: " + ip,
                    description: responseText,
                    author: {
                        name: "Checking ip"
                    }
                });
                sendMessage( interaction.channel, {
                    content: content,
                    embeds: [ embed]
                });

            }else{
                const embed = new Discord.MessageEmbed({
                    title: "Error",
                    description: "Failed requesting data to api"
                });
                sendMessage( interaction.channel, {
                    content: content,
                    embeds: [ embed]
                });
            }
        }
    });
    
    return info;
}
module.exports = config;