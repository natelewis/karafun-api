/* KaraFun API

   Copyright 2018 Nate Lewis

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 */

const WebSocketClient = require('websocket').client;
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const Status = require('./models/Status');
const ResponseHandler = require('./responseHandler');

/**
 * KaraFun API
 * @param {Object} defaults - Settings for KaraFun API
 * @param {number} [defaults.retryDelay=1000] - Delay in ms's before socket
 *    connection retries
 * @param {string} [defaults.server=localhost] - Location of KaraFun Socket
 *    Server
 * @param {number} [defaults.port=57570] - Socket port
 */
const KaraFunAPI = function({
  retryDelay = 10000,
  server = 'localhost',
  port = 57570,
} = {}) {
  const self = this;

  // configurable options
  this.retryDelay = retryDelay;
  this.server = server;
  this.port = port;

  // Create socket client
  this.client = new WebSocketClient;
  this.responseHandler = new ResponseHandler;
  this.status = new Status();

  // if connection failed, delay and try again
  this.client.on('connectFailed', function(error) {
    self.emit('connectionFailed', error);
    self.connect({delay: self.retryDelay});
    self.status.setState('disconnected');
  });

  this.client.on('connect', function(connection) {
    self.emit('connected');

    connection.on('error', function(error) {
      self.emit('connectionError', error);
    });

    connection.on('close', function() {
      self.emit('closed');
      self.connect({delay: self.retryDelay});
      self.status.setState('disconnected');
    });

    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        console.log(message.utf8Data);
        self.responseHandler.process(message.utf8Data,
          (action) => {
            self.emit(action);
          });
      }
    });
  });
};

/**
 * Connect to Karafun API Socket
 * @param {Object} default - Connection settings
 * @param {number}[default.delay=0] Delay before connecting in ms.
 */
KaraFunAPI.prototype.connect = function({delay = 0} = {}) {
  const self = this;

  // delay before we connect if set
  setTimeout(function() {
    const uri = 'ws://' + self.server + ':' + self.port + '/';
    self.emit('connecting', uri);
    self.client.connect(uri);
  }, delay);
};

/**
 * Return the current state of the player
 * @return {String} - IDLE, PLAYING, DISCONNECTED
 */
KaraFunAPI.prototype.getState = function() {
  return this.status.getState();
};

// extend the EventEmitter class
util.inherits(KaraFunAPI, EventEmitter);

module.exports = KaraFunAPI;
