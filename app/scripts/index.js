'use strict';

document.addEventListener('DOMContentLoaded', init, false);

var openButton = null;
var closeButton = null;
var rangeLED = null;

function init() {
    openButton = document.getElementById('open');
    openButton.addEventListener('click', openPort);

    closeButton = document.getElementById('close');
    closeButton.addEventListener('click', closePort);

    rangeLED = document.getElementById('led');
    rangeLED.addEventListener('change', send);

    var portsElement = document.getElementById('ports');
    portsElement.addEventListener('change', function (event) {
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
        openPort(portsElement);
    });
}

var connectionId = 0;

function openPort (element) {
    console.log("openPort");
    var selectedPort = element.childNodes[element.selectedIndex].value;
    console.log("Port " + selectedPort + " is selected.");
    var options = {
        bitrate:9600
    };
    chrome.serial.open(selectedPort, options, function (openInfo) {
        connectionId = openInfo.connectionId;
        console.log("openInfo.connectionId=" + connectionId);
        if (connectionId==-1) alert("Error.");
    });

}

function closePort () {
    chrome.serial.close(connectionId, function () {
        console.log("Closed.");
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
