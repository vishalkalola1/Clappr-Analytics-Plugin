import SocketService from './Socket'

class PlayerService {

    constructor(el){
        this._socketservice = SocketService.getInstance();
        this.bindAllEvents(el)

    }
  
    bindAllEvents (el) {
      for (const key in el) {
        if (key.slice(0, 2) === 'on') {
            el.addEventListener(key.slice(2), this.eventget);
        }
      }
    }
  
    _eventget(e){
      this.socketservice.senddata("playerevents", this.serializeEvent(e));
    }
  
    // Calculate a string representation of a node's DOM path.
    _pathToSelector(node) {
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
    };
  
    _tagconvetor(e){
      var obj = e.split('"').join('\'').split('\n').join(" ");
      return obj
    }
  
    // Generate a JSON version of the event.
    _serializeEvent(e) {
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
                  o[key] = this.tagconvetor(value.outerHTML)
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
        return {type:e.type, json:o, datetime: Date.now().toString()};
      }
    }
  }

  export default PlayerService;