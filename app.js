const config = {
	ip_address: '192.168.0.101', // required: IP address of your Samsung Smart TV
	name: "New Samsung Remote"
};
const Remote = require('./lib/new-samsung-remote');

const remote = Remote(config);

remote.api_active();
remote.sendKey('KEY_PRECH', function(err, res){
    if (err) {
        throw new Error(err);
    } else {
        console.log(res);
    }
});


