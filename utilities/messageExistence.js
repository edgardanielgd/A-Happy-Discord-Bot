const pkgExistence = {
    checkExistence : ( msg ) => {
        return new Promise( async (resolve, reject) => {
            const id = msg.id;
            const got = await msg.channel.messages.fetch( id );
            if( got ) resolve( true );
            resolve( false );
        });
    }
}
module.exports = pkgExistence;