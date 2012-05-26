/**
* Copyright 2011 Microsoft Corporation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var Rx            = require("./rx.node");
var child_process = require("child_process");

for (var k in child_process) {
    exports[k] = child_process[k];
}

exports.exec = function (command, options) {
    var subject = new Rx.AsyncSubject(),
    handler = function (err, stdout, stderr) {
        if (err !== null) {
            subject.onError(err);
        } else {
            subject.onNext({ stdout: stdout, stderr: stderr });
            subject.onCompleted();
        }
    };
    child_process.exec(command, options, handler);
    return subject;
};

exports.execFile = function (file, args, options) {
    var subject = new Rx.AsyncSubject(),
    handler = function (err, stdout, stderr) {
        if (err !== null) {
            subject.onError(err);
        } else {
            subject.onNext({ stdout: stdout, stderr: stderr });
            subject.onCompleted();
        }
    };
    child_process.execFile(file, args, options, handler);
    return subject;
};

exports.spawn = function (command, args, options) {
    var process = child_process.spawn(command, args, options);
    process.asObservable = function() {
	return Rx.Observable.createWithDisposable(function (observer) {
	    process.stdout.on('data', function (data) {
		observer.onNext(data);
	    });
	    process.stderr.on('data', function (data) {
		observer.onError(data);
	    });
	    process.on('exit', function (code) {
		if (code !== 0) {
	            observer.onCompleted();
		} else {
	            observer.onError(code);
		}
	    });
	    return Rx.Disposable.empty;
	});
    };
    return process;
};
