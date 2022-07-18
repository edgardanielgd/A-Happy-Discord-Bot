const dgram = require("dgram");
const queryMessage = "\\query";
const maxAwaitTime = 1500;

class connection {
    constructor( ip, port){
        this.ip = ip;
        this.port = port;
        this.con = dgram.createSocket("udp4");
    }

    send = () => {
        let initial_time = new Date();
        return new Promise( ( resolve, reject ) => {
            this.con.on( "error" , (err) => {
                this.con.close();
                const awaited_time = new Date() - initial_time;
                resolve({
                    type: "Connection error",
                    error: err.message,
                    ip: this.ip,
                    port : this.port,
                    time: awaited_time
                })
            });

            this.con.on( "message", (message, rinfo) => {
                clearTimeout( this.timeOutId );
                this.con.close();
                const ping = new Date() - initial_time;
                resolve({
                    data: message,
                    ip: this.ip,
                    port : this.port,
                    ping
                });
            });

            this.con.send( queryMessage, 0, queryMessage.length , this.port, this.ip);

            this.timeOutId = setTimeout( () => {
                resolve({
                    type: "Timeout error",
                    error: "Waited " + maxAwaitTime + " ms for a server reply",
                    ip: this.ip,
                    port : this.port,
                    time: maxAwaitTime
                })
            }, maxAwaitTime);
        });
    }
    
}
module.exports = connection;