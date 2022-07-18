const checkAuth = require( "./checkAuth");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const verifyIp = require("../utilities/validateIpFormat");
const { vpnapi } = require("../config/config");
const countries = require("../countries.json");

const command_names = [
    "checkip2",
    "reputation2",
    "vpn",
    "vpninfo",
    "vpnreputation",
];
const info = {
    commands_aliases: [
        { "Check reputation (second option)": command_names }
    ],
    information: "Check an ip reputation",
    emoji: "🕵️‍♀️"
}

const requestInfo = ( ip ) => {
    return new Promise( ( resolve, reject ) => {
        let xhr=new XMLHttpRequest();
        xhr.open("GET",
            "https://vpnapi.io/api/"+ip
            +"?key=" + vpnapi);
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
    try{
        response+="Country name: " + countries[data["location"]["country_code"]]+"\n";
		response+="Tor: " + data["security"]["tor"]+"\n";
		response+="Proxy: " + data["security"]["proxy"]+"\n";
    	response+="VPN: " + data["security"]["vpn"]+"\n";
		response+="Network: " + data["network"]["network"]+"\n";
		response+="Organization: " + data["network"]["autonomous_system_organization"]+"\n";
    }catch( e ){
        response+= "Invalid ip/ data response"
    }
    response+= "\n```"

    return response;
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

    return info;
}
module.exports = config;