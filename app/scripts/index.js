'use strict';

document.addEventListener('DOMContentLoaded', init, false);

var connectionId = null;
var buffer = new ArrayBuffer(1);
var bufferAsArray = new Uint8Array(buffer);

function init() {
    var luminanceElement = document.getElementById('luminance');
    luminanceElement.addEventListener('change', function (event) {
        send(event.target.value);
    });

    var portsElement = document.getElementById('ports');
    portsElement.addEventListener('change', function (event) {
        closePort();
        openPort(event.target);
    });

    chrome.serial.getPorts(function (ports) {
        var selectedIndex = 0;
        for (var i = 0; i < ports.length; i++) {
            var port = ports[i];
            portsElement.appendChild(new Option(port, port));

            if (port.match(/\/dev\/tty.usbserial-.+/)) {
                selectedIndex = i;
            }
        }
        portsElement.selectedIndex = selectedIndex;

        closePort();
        openPort(portsElement);
    });
}

function openPort (element) {
    var selectedPort = element.childNodes[element.selectedIndex].value;
    var options = {
        bitrate: 9600
    };
    chrome.serial.open(selectedPort, options, function (openInfo) {
        if (openInfo.connectionId !== -1) {
            console.log('Connected.');
            connectionId = openInfo.connectionId;
        } else {
            console.log('Connection failed.');
            connectionId = null;
        }
    });
}

function closePort () {
    if (connectionId === null) {
        return;
    }

    chrome.serial.close(connectionId, function () {
        console.log('Disconnected.');
        connectionId = null;
    });
}

function send (value) {
    bufferAsArray[0] = value;
    chrome.serial.write(connectionId, buffer, function () {});
}
