'use strict';

document.addEventListener('DOMContentLoaded', init, false);

var select = null;
var openButton = null;
var closeButton = null;
var rangeLED = null;

function init() {
    select = document.getElementById('ports');

    openButton = document.getElementById('open');
    openButton.addEventListener('click', openPort);

    closeButton = document.getElementById('close');
    closeButton.addEventListener('click', closePort);

    rangeLED = document.getElementById('led');
    rangeLED.addEventListener('change', send);

    chrome.serial.getPorts(function (ports) {
        for (var i=0; i<ports.length; i++) {
            var port = ports[i];
            select.appendChild(new Option(port, port));
        }
    });
}

var connectionId = 0;
var selectedPort = null;

function openPort () {
    console.log("openPort");
    selectedPort = select.childNodes[select.selectedIndex].value;
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
