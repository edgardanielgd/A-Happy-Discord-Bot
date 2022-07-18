const maxNameLength = 20;
const verifyIp = require("./../utilities/validateIpFormat");

const pkgValidation = {
    validateInsertion : ( args ) => {
        if( args.length >= 3) {
            const ip = args[0];
            const name = args[1];
            const server = args[2];
            
            if( name.length > maxNameLength || name.length <= 0)
                return {
                    error: "Invalid name's length"
                }
            
            const { error } = verifyIp( ip );
            if( error ){
                return {
                    error: error
                };
            }

            if (isNaN(parseInt( server )))
                return {
                    error: "Server should be represented as a port"
                }

            return {
                valid: true
            }
        }else{
            return {
                error: "Missing args (three needed)"
            };
        }
    },

    validateQuery : ( args, fieldsAliases ) => {
        let type, value, page = null;
        if( args.length > 2){
            args[2] = parseInt( args[2] )
            if (isNaN( args[2] ))
                return {
                    error: "Wrong page number format"
                }
            page = args[2];
        }
        if( args.length > 1){
            value = args[1].toLowerCase();
            type = args[0].toLowerCase();
            
            if (isNaN(parseInt( type )))
                if( fieldsAliases.hasOwnProperty( type ) ){
                    type = fieldsAliases[ type ];
                    
                }else{
                    return {
                        error: "Type a correct type parameter"
                    }
                }
            
            type = parseInt( type );

            if( type < -1 || type >= fieldsAliases.length - 1){
                return {
                    error: "Type a correct type parameter"
                }
            }

            switch( type ){
                case -1:{
                    value = parseInt ( value );
                    if (isNaN(value))
                        return {
                            error: "Wrong page number format"
                        }
                    return {
                        type: -1,
                        page: value
                    }
                    break;
                }
                case 2:{
                    value = parseInt ( value );
                    if (isNaN(value))
                        return {
                            error: "Server must be a valid number"
                        }
                    return {
                        type: type,
                        value: value,
                        page: page
                    }
                    break;
                }
                default:{
                    return {
                        type: type,
                        value: value,
                        page: page
                    }
                    break;
                }
            }


        }else if( args.length > 0 && (fieldsAliases[ args[0] ] == -1 || parseInt( args[0] ) === -1)){
            return {
                type: -1
            }
        }else{
            return {
                error: "Missing arguments"
            }
        }
        
    }
}
module.exports = pkgValidation;