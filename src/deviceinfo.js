import {getGPUTier} from "detect-gpu";
import Utils from "./utils.js";

export default class DeviceInfo {
    constructor() {
        this.gpudata = null;
        this.utils = new Utils();
        this.getgpuData()
    }

    getgpuData(){
        getGPUTier().then((data)=>{
            this.gpudata = data;
        })
    }

    getdeviceinfo(){
        const o = {}
        o.useragent = this.utils.tagConvetor(navigator.userAgent)
        o.cookieEnabled = navigator.cookieEnabled
        o.cookie = this.getCookies()
        o.currentpageurl = this.utils.tagConvetor(document.URL)
        o.referrer = this.utils.tagConvetor(document.referrer)
        o.gpu = JSON.stringify(this.gpudata)

        o.screenwidth = screen.width;
        o.screenheight = screen.height;

        o.orientation = (screen.height < screen.width) ? 'landscape' : 'portrait';

        if (window.devicePixelRatio) {
            o.pixelDensity = window.devicePixelRatio;
            o.retinaDisplay = (screen.pixelDensity > 1) ? true : false;
        }

        if (window.navigator && window.navigator.maxTouchPoints) {
            o.maxTouchPoints = window.navigator.maxTouchPoints;
        }
        o.datetime = Date.now().toString();
        return o;
    }

    getCookies(){
        return this.utils.tagConvetor(document.cookie)
    }
}