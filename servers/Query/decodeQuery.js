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
const genString = (buffer) => {

	var array=decodeString(buffer.toString());
	

	let svName=array[2];
	let port=array[6];
	let maxPlayers=array[8];
 	let bcount=0, rcount=0;
	let password="";

	if(array[10] == "0"){
		password="FALSE";
	}else password="TRUE";

	let mapName=array[12];
	let numPlayers=array[20];
	let gametype=array[22];
	let teamplay="";

	if(array[24]=="0"){
		teamplay="FALSE";
	}else teamplay="TRUE";

	let gamevar=array[26];

	let str="`Server name:`\t "+svName+
            "\n`Port:`\t "+port+
            "\n`Max. Players:`\t "+maxPlayers+
            "\n`Password:`\t "+password+
            "\n`Map name:`\t "+mapName+
            "\n`Online Players:`\t "+numPlayers+
            "\n`Gametype:`\t "+gametype+
            "\n`Teamplay:`\t "+teamplay+
            "\n`Variant:`\t "+gamevar;

	let infPlayers="```\n";

	if(numPlayers=="0"){
		infPlayers+="No players online in this moment... (Maybe seed them?)";
	}else{
		for(let i=0;i<numPlayers;i++){
			let name = array[34 + i*2];
            let score = array[34 + numPlayers*2 + i*2];
            let ping = array[34 + numPlayers*4 + i*2];
            let Team = ""
            if(teamplay == "FALSE"){
                Team = "N\a"
            }else{
                let num = parseInt(array[34 + numPlayers*6 + i*2]);
                if(num == 0){
                    Team = "RED";
                    rcount+=1;
                }else{
                    Team = "BLUE";
                    bcount+=1;
                }
            }
			infPlayers+= (i+1)+
                        ". Name:"+name
                        +"\tScore: "+score
                        +"\tPing: "+ping
                        +"\tTeam: "+Team
                        +"\n";
		}
	}
	infPlayers+="\n```";
    let addTeamInfo = ""
    if(teamplay == "TRUE"){
        addTeamInfo+=
            "🟥 | `Count reds:` "+rcount
            +"\t`Score reds:` "+array[34 + numPlayers*8 + 4]
            +"\n";
        addTeamInfo+=
            "🟦 | `Count blues:` "+bcount
            +"\t`Score blues:` "+array[34 + numPlayers*8 + 6]+
            "\n";
    }
    return {
        description: str+infPlayers+addTeamInfo,
        map: mapName
    }
}

module.exports = genString;