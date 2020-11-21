# clappr-analytics-plugin

# Clappr Analytics Plugin
[here](https://github.com/vishalkalola1/clappr-analytics-plugin).

# Usage
Add both Clappr and the Analytics plugin scripts to your HTML:

```html
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr@0.3/dist/clappr.min.js"></script>
  <script type="text/javascript" src="../dist/clappr-analytics-plugin.js"></script>
</head>
```

Then just add `ClapprAnalyticsPlugin` into the list of plugins of your player instance, and the options for the plugin go in the `analyticsdata` property as shown below.

```javascript
var player = new Clappr.Player({
    source: "https://tjenkinson.me/clappr-thumbnails-plugin/assets/video.mp4",
    parentId: "#player",
    plugins: {
        container: [ClapprAnalyticsPlugin]
    },
    analyticsdata: {
        socketbaseurl: 'http://0.0.0.0:5000', // set to 0 or null to disable backdrop
        channelname: "playerevents", // set to 0 or null to disable spotlight
    }
});
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
