'use strict';

document.addEventListener('DOMContentLoaded', init, false);

var connectionId = null;
var rangeLED = null;

function init() {
    rangeLED = document.getElementById('led');
    rangeLED.addEventListener('change', send);

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
            console.log("Connected.");
            connectionId = openInfo.connectionId;
        } else {
            console.log("Connection failed.");
            connectionId = null;
        }
    });
}

function closePort () {
    if (connectionId === null) {
        return;
    }

    chrome.serial.close(connectionId, function () {
        console.log("Disconnected.");
        connectionId = null;
    });
}

function send () {
    var ledVal = rangeLED.value;
    var buff = new ArrayBuffer(1);
    var arr = new Uint8Array(buff);
    arr[0] = ledVal;
    console.log("Send " + ledVal);
    chrome.serial.write(connectionId, buff,
        function (sendInfo){
            console.log("Sent.");
        });
}
