import { ContainerPlugin, Events } from 'clappr'
import SocketService from './socket.js'
import DeviceInfo from "./deviceinfo.js";
import Utils from "./utils.js";


export default class PlayerService extends ContainerPlugin {

    constructor(container) {
       super(container);
       this.deviceinfo = new DeviceInfo();
       this.utis = new Utils();
       this.fullscreen = false;
       this.analysisdata = container.options.analyticsdata;
       if (this.analysisdata) {
           this.socketservice = new SocketService(this.analysisdata,this.deviceinfo,this.utis);
           if (this.socketservice) {
               this.addEventListeners()
           }
       }
    }

    addEventListeners() {
        if (this.container) {
            this.listenTo(this.container, Events.CONTAINER_READY, this.onReady)
            this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
            this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
            this.listenTo(this.container, Events.CONTAINER_PAUSE, this.onPause)
            this.listenTo(this.container, Events.CONTAINER_ENDED, this.onEnded)
            this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERING, this.onBuffering)
            this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERFULL, this.onBufferFull)
            this.listenTo(this.container, Events.CONTAINER_ERROR, this.onError)
            this.listenTo(this.container, Events.CONTAINER_PLAYBACKSTATE, this.onPlaybackChanged)
            this.listenTo(this.container, Events.CONTAINER_VOLUME, (event) => this.onVolumeChanged(event))
            this.listenTo(this.container, Events.CONTAINER_SEEK, (event) => this.onSeek(event))
            this.listenTo(this.container, Events.CONTAINER_FULLSCREEN, this.onFullscreen)
            this.listenTo(this.container, Events.CONTAINER_HIGHDEFINITIONUPDATE, (event) => this.onHD(event))
            this.listenTo(this.container, Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.onDVR)
        }
    }

    onReady() {
        let o = {type:'Playback',value:'',name:this.container.playback.name}
        this.push(o)
    }

    onPlay() {
        let o = {type:'Play',value:'',name:this.container.playback.src}
        this.push(o)
    }

    onStop() {
        let o = {type:'stop',value:'',name:this.container.playback.src}
        this.push(o)
    }

    onEnded() {
        let o = {type:'Ended',value:'',name:this.container.playback.src}
        this.push(o)
    }

    onBuffering() {
        let o = {type:'Buffering',value:'',name:this.container.playback.src}
        this.push(o)
    }

    onBufferFull() {
        let o = {type:'BufferFull',value:'',name:this.container.playback.src}
        this.push(o)
    }

    onError() {
        let o = {type:'Error',value:'',name:this.container.playback.src}
        this.push(o)
    }

    onHD(isHD) {
        const status = isHD ? 'ON': 'OFF'
        if (status !== this.currentHDState) {
            this.currentHDState = status
            let o = {type:'HD',value:status,name:this.container.playback.src}
            this.push(o)
        }
    }

    onPlaybackChanged(playbackState) {
        if (playbackState.type !== null) {
            let o = {type: 'Playback Type', value: playbackState.type, name: this.container.playback.src}
            this.push(o)
        }

    }

    onDVR(dvrInUse) {
        const status = dvrInUse? 'ON': 'OFF'
        let o = {type:'CVR',value:status,name:this.container.playback.src}
        this.push(o)
    }

    onPause() {
        let o = {type:'Pause',value:'',name:this.container.playback.src}
        this.push(o)
    }

    onSeek() {
        let o = {type:'Seek',value:'',name:this.container.playback.src}
        this.push(o)
    }

    onVolumeChanged(e) {
        let o = {type:'Volume',value:e.toString(),name:this.container.playback.src}
        this.push(o)
    }

    onFullscreen() {
        this.fullscreen = !this.fullscreen;
        let full = this.fullscreen ? 'ON' : 'OFF';
        let o = {type:'Fullscreen',value:full,name:this.container.playback.src};
        this.push(o)
    }

    push(data) {
        const deviceinfo = this.deviceinfo.getdeviceinfo();
        const mergedInfo = this.utis.mergedict(data, deviceinfo);
        this.senddata(mergedInfo)
    }

    senddata(data){
        this.socketservice.emitData(data);
    }
}
