const handle = function (req, res) {

        var config = {
                ip_address: '192.168.13.204',
                name: "New Samsung Remote"
        };
        var Remote = require('new-samsung-remote');
        var remote = Remote(config);
        remote.api_active();

        if (req.url == '/') { //check the URL of the current request
                // set response header
                res.writeHead(200, { 'Content-Type': 'text/html' });

                // set response content
                res.write('<html><body><p>waiting for Key for Samsung TV. . .</p></body></html>');
                res.end();
        }
        else if (req.url == "/KEY_MENU") {
                const config = {
                        ip_address: '192.168.13.203',
                        name: "New Samsung Remote"
                };
                const Remote = require('new-samsung-remote');
                const remote = Remote(config);
                remote.api_active();
                remote.sendKey('KEY_MENU', function(err, result) {
                        if(err) {
                                throw new Error(err);
                        }else {
                                console.log(result);
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({ message: "KEY_MENU Pressed." }));
                        //res.write('<html><body><p>'+ result +'</p></body></html>');
                        res.end();
                })
        }
        else if (req.url == "/KEY_HOME") {
                remote.api_active();
                remote.sendKey('KEY_HOME', function(err, result) {
                        if(err) {
                                throw new Error(err);
                        }else {
                                console.log(result);
                        }
                });
                res.end();

        }
};

module.exports = handle;
