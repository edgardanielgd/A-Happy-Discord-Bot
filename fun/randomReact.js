const { addReaction } = require("./../utilities/responseManager");

const message_reactions = {
    "ok" : [
        {
            type: "letter",
            character: "O"
        },
        {
            type: "letter",
            character: "K"
        }
    ],
    "je" : [
        {
            type: "letter",
            character: "J"
        },
        {
            type: "letter",
            character: "E"
        }
    ],
    "legendgay" : [
        {
            type: "emoji",
            emoji: "🏳️‍🌈"
        }
    ]
};

const reactInRow  = ( msg, arr, index) => {
    return new Promise( (resolve, reject) => {
        if( index > arr.length ) 
            return {
                error: "Invalid index for array"
            };
        if( index == arr.length) {
            resolve({
                success: "Finished"
            });
            return;
        }
        const info = arr[ index ];
        let reaction;
        if( info.type == "letter"){
            reaction = String.fromCodePoint(info.character.codePointAt(0) - 65 + 0x1f1e6);
        }else if( info.type == "emoji"){
            reaction = info.emoji;
        }
        addReaction( msg, reaction)
        .then( result => {
            if( result ) {
                reactInRow ( msg, arr, index + 1)
                .then( rowResult => {
                    resolve( rowResult )
                })
                .catch( e => {
                    console.log(e);
                    resolve({
                        error: e.message
                    })
                });
            }else
                resolve({
                    error: "Couldnt add reaction"
                })
        })
        .catch( e => {
            console.log( e );
            resolve({
                error: e.message
            });
        })
            
        
    })
}

const config = (event) => {
    event.on("messageCreate", async (bot, Response, msg, securityManager) => {
        
        const data = message_reactions[ msg.content.toLowerCase() ];
        if( data ){
            if( !securityManager.allowIncomingMessage( msg.author ) ) return;

            reactInRow( msg, data, 0)
            // .then( result => [ if result have success, all reactions were placed correctly])
        }

    });
}
module.exports = config;