const WebSocket = require('ws')
const request = require('request')

class Samsung {
  constructor (config) {
    this._name = config.name || 'Samsung Remote'
    this._ip_address = config.ip_address
    this._api_timeout = config.api_timeout || 2000

    if (!this._ip_address) {
      throw new Error("You must provide a value for 'ip_address'.")
    }

    this._app_name_base64 = (Buffer.from(this._name)).toString('base64')
  }

  /**
   * Reutnrs promise
   * @param {String} key
   */
  sendKey (key) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket('http://' + this._ip_address + ':8001/api/v2/channels/samsung.remote.control?name=' + this._app_name_base64)
      ws.on('message', (data) => {
        const cmd = {
          'method': 'ms.remote.control',
          'params': {
            'Cmd': 'Click',
            'DataOfCmd': key,
            'Option': 'false',
            'TypeOfRemote': 'SendRemoteKey'
          }
        }

        data = JSON.parse(data)
        if (data.event === 'ms.channel.connect') {
          ws.send(JSON.stringify(cmd), (err) => {
            if (err) {
              reject(err)
            }

            // send does not seem to be done here so we need to wait a bit longer
            setTimeout(() => {
              ws.close()
              resolve()
            }, 1000)
          })
        }
      }).on('response', (response) => {
        console.log(response.statusCode)
      }).on('error', (err) => {
        console.log(err)
      })
    })
  }

  /**
   * Returns promise
   */
  tvReady () {
    return new Promise((resolve, reject) => {
      request.get({ url: 'http://' + this._ip_address + ':8001/api/v2/', timeout: this._api_timeout }, (err, res) => {
        if (err) {
          console.log('No response from TV')
          reject(err)
        }

        if (res.statusCode === 200) {
          resolve()
        }
      })
    })
  }
}

module.exports = Samsung
