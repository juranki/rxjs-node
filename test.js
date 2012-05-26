var child_process = require("./lib/rx_child_process.js");
var events        = require("./lib/rx_events.js");
var http          = require("./lib/rx_http.js");
var net           = require("./lib/rx_net.js");
var process       = require("./lib/rx_process.js");
var dns           = require("./lib/rx_dns.js");
var fs            = require("./lib/rx_fs.js");
var https         = require("./lib/rx_https.js");
var path          = require("./lib/rx_path.js");
var sys           = require("./lib/rx_sys.js");
var assert        = require("assert");

console.log("all loaded");

// Test child_process.
var proc = child_process.spawn('cat');
proc.asObservable().select(function(data) {
	return data.toString().trim();
    }).subscribe(function(data) {
	console.log("child_process.spawn", data);
	assert.equal(data,"hello","child_process.spawn");
	proc.kill();
    });
proc.stdin.write("hello\n");






