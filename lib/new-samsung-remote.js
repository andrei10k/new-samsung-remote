const WebSocket = require('ws');
const request = require('request');

module.exports = function(config) {
	const config = config,
              name = config["name"],
              ip_address = config["ip_address"],
              api_timeout = config["api_timeout"] || 2000,
              port = config['port'];

    if (!ip_address) {
        throw new Error("You must provide a value for 'ip_address'.");
    }
    const app_name_base64 = (new Buffer(config["name"] || "New Samsung Remote")).toString('base64');

    return {
      sendKey: function(key, done) {
        var ws = new WebSocket('http://' + ip_address + ':8001/api/v2/channels/samsung.remote.control?name=' + app_name_base64);
        ws.on('message', function(data) {
          var cmd =  {
              "method":"ms.remote.control",
              "params": {
                  "Cmd": "Click",
                  "DataOfCmd": key,
                  "Option": "false",
                  "TypeOfRemote": "SendRemoteKey"
              }
          };

          data = JSON.parse(data);
          if (data.event == "ms.channel.connect") {
            ws.send(JSON.stringify(cmd));
            // setTimeout is necessary because the connection is closed before the tv action is completed
            setTimeout(function(){
              ws.close();
              done(0);
            }, 500);
          }
        }).on('response', function(response) {
          console.log(response.statusCode);
        }).on('error', function(err) {
          console.log(err);
        })
      },

      api_active: function(done) {
        request.get({ url: 'http://' + ip_address + ':8001/api/v2/', timeout: api_timeout}, function(err, res) {
          if(!err && res.statusCode === 200) {
            console.log('TV is on');
            if (done) {
              done(true);
	    }
          } else {
            console.log('No response from TV');
            if (done) {
	      done(false);
            }
          }
        });
      }
    }
};
