const decodeString = (string) => {
	var string_ret="";
	var arreglo=[];
	for(let i=0;i<string.length;i++){
		let code=string.charCodeAt(i);
		if(code==92){
			arreglo.push(string_ret);
			string_ret="";
			continue;
		}
		if(code==1)continue;
		if(code==2)continue;
		if(code==42)continue;
		if(code==95)continue;
		if(code==96)continue;
		if(code==126)continue;
		string_ret+=string[i];
	}
	return arreglo;
}

const decode = (buffer) => {

	const array = decodeString( buffer );
    let maxPlayers = array[ 8 ];
    let numPlayers = array[ 20 ];
    let description = "```\n";
    let svname = array[2];
    
    description += "SERVER NAME: " + svname + "\n\n";

    for(let i=0;i<numPlayers;i++){

        let name = array[34 + i*2];
        let num = parseInt(array[34 + numPlayers*6 + i*2]);
        let team = "";
        if(num == 0){
            team = "RED";
        }else{
            team = "BLUE";
        }

        description += (i+1) + " " + name + " team: " + team + "\n";
    }

    description += "\n```";

    return [ numPlayers, maxPlayers, description];
}
module.exports = decode;