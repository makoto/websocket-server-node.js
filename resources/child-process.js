var sys = require('sys');

var _process = null;

exports.handleData = function(connection, data) {
    var _data = eval('(' + data + ')');

    if (_data.charCode !== undefined) {
        sys.puts('GOT SOMETHING!');
        _process.write(_data.charCode);
        return;
    }

    function sendJSON(data) {
        connection.send('\u0000' + JSON.stringify(data) + '\uffff');
    }

    _process = process.createChildProcess(_data.command, _data.args, _data.env)

    .addListener('output', function(data) {
        if (data !== null)
            sendJSON({ event: 'output', data: data });
    })
    .addListener('error', function(data) {
        if (data !== null)
            sendJSON({ event: 'error', data: data });
    })
    .addListener('exit', function(code) {
        sendJSON({ event: 'exit', code: code });
    });
}

