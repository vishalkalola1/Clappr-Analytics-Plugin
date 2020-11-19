import * as io from 'socket.io-client';

class SocketService {
  
    _constructor(){
      this._socket = io("0.0.0.0:5000")
      SocketService._instance = SocketService;
      this.connectDisconnectSub();
    }
  
    static get getInstance() {
      if (!SocketService.instance) {
        SocketService._instance = new SocketService(); 
      }
      return SocketService._instance;
    }
  
    _connectDisconnectSub(){
      this.socket.on('connect', () => {
        console.log('===>> User connected with socket ID: ', this.socket.id, '<<===');
      });
  
      this.socket.on('disconnect', () => {
        console.log('===>> User disconnected <===');
      });
    }
  
    disconnectSocket(){
      this.socket.disconnect()
    }
  
    senddata(channel, requestdata){
      this.socket.emit(channel, requestdata, (data) => {
        console.log(" ---- Event reached ----\n" + data);
      });
    }
  }

  export default SocketService
  