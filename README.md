# Clappr Analytics Plugin
[![npm version](https://i.imgur.com/Q4lReQ8.png)](https://github.com/vishalkalola1/clappr-analytics-plugin)

**A plugin for clappr which will get all user events. Event handlers can be used to handle and verify user input, user actions, and browser actions:**

* Things that should be done every time a page loads
* Things that should be done when the page is closed
* Action that should be performed when a user clicks a button
* Content that should be verified when a user inputs data
* And more ...

**Many different methods can be used to let JavaScript work with events:**

* HTML event attributes can execute JavaScript code directly
* HTML event attributes can call JavaScript functions
* You can assign your own event handler functions to HTML elements
* You can prevent events from being sent or being handled
* And more ...

# Usage
Add both Clappr and the Analytics plugin scripts to your HTML:

**HTML**
```
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr@0.3/dist/clappr.min.js"></script>
  <script type="text/javascript" src="../dist/clappr-analytics-plugin.js"></script>
</head>
```

Then just add `ClapprAnalyticsPlugin` into the list of plugins of your player instance, and the options for the plugin go in the `analyticsdata` property as shown below.

**Javascript**
```
var player = new Clappr.Player({
    source: "https://tjenkinson.me/clappr-thumbnails-plugin/assets/video.mp4",
    parentId: "#player",
    plugins: {
        container: [ClapprAnalyticsPlugin]
    },
    analyticsdata: {
        socketbaseurl: 'http://0.0.0.0:5000', // add your backend url
        channelname: "events", // get channelname from backend and add here
        offlinedatachannelname: "offlineevents" // get offlineevents from backend and add here
    }
});
```

**Note: Setup Flask with socket.io and connect through websocket. do not use transport long-polling method use websocket**

**Backend**
```
@socketio.on("offlineevents") // "offlineevents" channel name in frontend
def handle_offlinedata(messages):
    return messages
    
@socketio.on("events") // "events" channel name in frontend
def handle_Channel1(message):
    return message
```

# Demo
To run the demo start a web server with the root directory being the root of this repo, and then browse to the "index.html" file in the "demo" folder.

# Development
* Install dependencies:

`npm install`

* Build:

`npm run build`

* Minified version:

`npm run release`
