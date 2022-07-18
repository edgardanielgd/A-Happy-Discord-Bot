const verifyIp = ( ip ) => {
    let checkArreglo=ip.split(".");
    if(checkArreglo.length != 4){
        return {
            error: "Ip has not 4 sections",
            message: 
            "Could you please try again with a valid ip?...\nWhat about a server offline?"
        }
    }
    for(let i=0;i<checkArreglo.length;i++){
        try{
            let part=parseInt(checkArreglo[i]);
            if((part<0 || part>255 ||!part || isNaN(part)) && part!=0){
                return {
                    error: "One ip's section has not correct format",
                    message: 
                    "Could you please try again with a valid ip?...\nWhat about a server offline?"
                }
            }
        }catch(e){
            return {
                error: "One ip's section has not correct format",
                message: 
                "Could you please try again with a valid ip?...\nWhat about a server offline?"
            }
        }
    }
    return {
        success: true
    }
}

module.exports = verifyIp;