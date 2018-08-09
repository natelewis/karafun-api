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

   Status object

 */

'use strict';

const constants = require('../constants');
let statusInstance = null;

/**
 * Status object singleton class
 */
class Status {
  /**
   * Be a singleton
   */
  constructor() {
    if (!statusInstance) {
      statusInstance = this;
    }
    return statusInstance;
  }

  /**
   * Get the current state of the player
   * @return {string} - IDLE, PLAYING, DISCONNECTED
   */
  getState() {
    switch (this.state) {
      case 'infoscreen':
        return constants.statusIdle;
      case 'idle':
        return constants.statusIdle;
      case 'playing':
        return constants.statusPlaying;

      default:
        return constants.statusDisconnected;
    }
  }

  /**
   * Set the current state of the player
   * @param {[type]} state - State as returned from socket API
   */
  setState(state) {
    // Socket API will return invoscreen, idle, or playing.
    this.state = state;
  }
}

module.exports = Status;
