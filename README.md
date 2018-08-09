Karafun API interface for Node.js
=================================================

Overview
--------
This is an Node.js API KaraFun Player V2.  This abstracts that web socket API and converts it into some conveinent functions and event emmitters.

KaraFun Version Support
-----------------------

Current KaraFun Player for Windows is the only version with this capability.

Usage
-----

In your project root:

    $ npm install karafun-api --save

Then in your code:

```javascript
const KaraFunAPI = require('karafun-api');

const kapi = new KaraFunAPI();

kapi.on('connecting', (uri) => {
  console.log('connecting: Attempting connection to KaraFun API: ' + uri);
});

kapi.on('connected', () => {
  console.log('connected: KaraFun API has connected');
});

kapi.on('closed', () => {
  console.log('closed: Socket was closed, retrying in 10 seconds');
});

kapi.on('connectionFailed', (error) => {
  console.log('connectionFailed: ' + error.toString());
});

kapi.on('connectionError', (error) => {
  console.log('connectionError: ' + error.toString());
});

kapi.on('statusUpdated', () => {
  console.log('statusUpdated:');
  console.log('  state: ' + kapi.getState());
});

kapi.on('playStarted', () => {
  console.log('playStarted: Song has started');
});

kapi.on('playStopped', () => {
  console.log('playStopped: Song has stopped');
});

// connect to socket
kapi.connect();
```

License
-------
Apache 2.0 - See [LICENSE][license] for more information.

[license]: LICENSE
