
export default class Utils{

    constructor() {

    }

    // Calculate a string representation of a node's DOM path.
    pathToSelector(node) {
        if (!node || !node.outerHTML) {
            return null;
        }

        var path;
        while (node.parentElement) {
            var name = node.localName;
            if (!name) break;
            name = name.toLowerCase();
            var parent = node.parentElement;

            var domSiblings = [];

            if (parent.children && parent.children.length > 0) {
                for (var i = 0; i < parent.children.length; i++) {
                    var sibling = parent.children[i];
                    if (sibling.localName && sibling.localName.toLowerCase) {
                        if (sibling.localName.toLowerCase() === name) {
                            domSiblings.push(sibling);
                        }
                    }
                }
            }

            if (domSiblings.length > 1) {
                name += ':eq(' + domSiblings.indexOf(node) + ')';
            }
            path = name + (path ? '>' + path : '');
            node = parent;
        }
        return path;
    }

    tagConvetor(e){
        var obj = e.split('"').join('\'').split('\n').join(" ").split(';').join(",");
        return obj
    }

    // Generate a JSON version of the event.
    serializeEvent(e) {
        if (e) {
            var o = {}
            for (const key in e) {
                let value = e[key]
                if (value instanceof Object && typeof value !== 'function'){
                    switch(key){
                        case "path":
                            o[key] = this.pathToSelector(e.path && e.path.length ? e.path[0] : null)
                            break;
                        default:
                            if(value && value.outerHTML){
                                o[key] = this.tagConvetor(value.outerHTML)
                            }else{
                                o[key] = value ? value.toString() : null
                            }
                            break;
                    }
                } else if (typeof value !== 'function') {
                    o[key] = value
                } else {
                    o[key] = (typeof value).toString();
                }
            }
            return o
        }
        return null
    }

    generateUUID () {
        let time = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            time += performance.now();
        }
        return 'xxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let random = (time + Math.random() * 16) % 16 | 0;
            time = Math.floor(time / 16);
            return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16);
        });
    }

    mergedict(){
        const merged = Object.assign({}, arguments[0], arguments[1]);
        return merged;
    }
}