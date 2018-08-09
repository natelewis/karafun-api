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

   KaraFun Socket API response handler

 */

'use strict';

const constants = require('./constants');
const xml2js = require('xml2js');
const Status = require('./models/Status');

/**
 * Class to handle the socket responses from KaraFun App
 */
class ResponseHandler {
  /**
   * Bring in data models and parser
   */
  constructor() {
    this.parser = new xml2js.Parser({mergeAttrs: true});
    // Data models
    this.status = new Status();
  }

  /**
   * Process incomming responses and update data
   * @param  {String} utf8Data Raw XML from socket
   * @param  {String} callback Callback function that receives a sting that was
   *                           was updated
   */
  process(utf8Data, callback) {
    const self = this;
    this.parser.parseString(utf8Data, function(err, result) {
      console.log(result);
      console.log(result.status.queue[0].item);
      // Detect if we are a status update and process it
      if ( typeof(result.status) !== 'undefined') {
        const oldState = self.status.getState();
        self.status.setState(result.status.state[0]);
        const newState = self.status.getState();

        // if status changed emit if play has started or stopped
        if (newState !== oldState) {
          if (newState === constants.statusPlaying) {
            callback('playStarted');
          }
          if (oldState === constants.statusPlaying) {
            callback('playStopped');
          }
        }

        callback('statusUpdated');
      }
    });
  }
}

module.exports = ResponseHandler;
