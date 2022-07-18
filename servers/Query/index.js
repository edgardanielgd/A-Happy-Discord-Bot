const query = require("./simpleQuery");

config = (event,scc) => {
    return query( event , scc );
}
module.exports = config