import io from 'socket.io-client';

export default class SocketService {

    constructor(options, deviceinfo, utils) {
        this.offlineData = [];
        this.options = options;
        this.deviceinfo = deviceinfo;
        this.utis = utils;
        this.manager = io(options.socketbaseurl,{reconnection:true, transports: ['websocket'], upgrade: false, autoConnect:true});
        this.removeAllListener();
        this.connectDisconnectSub();
    }

    connectDisconnectSub() {
        this.manager.on('connect', () => {
            console.log(" ===>> Socket Connected with id <<=== ");
            this.connectdisconnectEvent("connect");
        });

        this.manager.on("disconnect",() => {
            console.log("===>>> Socket Disconnect <<<===")
            this.connectdisconnectEvent("disconnect");
        })
        this.manager.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
          });
    }

    removeAllListener(){
        this.manager.removeAllListeners();
    }

    connectdisconnectEvent(eventName){
        const connection = this.sockettoJson(eventName);
        const deviceinfo = this.deviceinfo.getdeviceinfo();
        const mergedInfo = this.utis.mergedict(connection, deviceinfo);
        this.emitData(mergedInfo);
        if (this.offlineData.length > 0) {
            this.sendofflineData();
        }
    }

    sockettoJson(event){
        let connection = {type:event};
        for (var key in this.manager){
            let value = this.manager[key];
            if (key == "io"){
                connection[key] = this.getIOValue(value);
            }else if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
                connection[key] = value
            }
        }
        return connection;
    }

    getIOValue(e){
        let o = {};
        for (const key in e) {
            if(key != "0") {
                let value = e[key]
                if (value instanceof Object && typeof value !== 'function') {
                    switch (key){
                        case 'backoff':
                            o[key] = this.extractData(value);
                            break;
                        case 'engine':
                            var enginetmp = this.extractData(value);
                            enginetmp['transport'] = this.extractData(value['transport']);
                            o[key] = enginetmp;
                            break;
                        case 'opts':
                            o[key] = this.extractData(value);
                            break;
                        case 'lastPing':
                            o[key] = this.extractData(value);
                            break;
                        default:
                            break;
                    }
                } else if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
                    o[key] = value
                }
            }
        }
       return o;
    }

    extractData(data) {
        let o = {}
        if (data) {
            for (let key in data) {
                let value = data[key];
                if (typeof value !== 'undefined') {
                    if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
                        o[key] = value;
                    } else if (value instanceof Array) {
                        o[key] = value.toString();
                    }
                }else{
                    o[key] = null;
                }
            }
        }
        return o;
    }

    disconnectSocket() {
        this.manager.disconnect();
    }

    emitData(requestdata) {
        if (this.manager.connected) {
            this.manager.emit(this.options.channelname, requestdata, (data) => {
                console.log(" ---- Event reached ---- ", data);
            });
        }else{
            this.offlineData.push(requestdata)
            console.log("Server not connected")
        }
    }

    sendofflineData(){
        if (this.manager.connected) {
            this.manager.emit(this.options.offlinedatachannelname, this.offlineData, (data) => {
                console.log(" ---- Offline Event reached ---- ", data);
            });
            this.offlineData = [];
        }
    }
}
