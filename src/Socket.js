import io from 'socket.io-client';

export default class SocketService {

    constructor(options) {
        this.manager = io(options.socketbaseurl,{reconnection:true});
        this.manager.removeAllListeners();
        this.connectDisconnectSub();
    }

    connectDisconnectSub() {
        this.manager.on('connect', (socket) => {
            console.log("Socket Connected"); // 'G5p5...'
        });

        this.manager.on("disconnect",()=>{
            console.log("===>>> Socket Disconnect <<<===")
            this.manager.removeAllListeners();
        })
    }

    disconnectSocket() {
        this.manager.disconnect();
    }

    senddata(channel, requestdata) {
        this.manager.emit(channel, requestdata, (data) => {
            console.log(" ---- Event reached ---- ");
        });
    }
}
