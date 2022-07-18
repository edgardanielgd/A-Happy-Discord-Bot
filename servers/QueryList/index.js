const queryList = require("./queryList");

config = (event, scc) => {
    return queryList( event , scc );
}
module.exports = config