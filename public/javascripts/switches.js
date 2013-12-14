// Define global variables
var switchStatus=new Array(); 

//Connect to socket server
var socket = io.connect(); 

//Functions to do after socket connects
//socket.on('connect', function () {});

//Recieve switch status updates from socket server and 
//update software switches
socket.on('updateSoftwareSwitches', function (data) {
	var receivedSwitchStatus=JSON.parse(data);
	for (var i=0; i<50; i++) { 
		console.log(receivedSwitchStatus[i])
		$( "#switch_" + i).val(receivedSwitchStatus[i]);
		$( "#switch_" + i).slider('refresh');
	};
});



//////////////////////////////////
//FUNCTIONS
/////////////////////////////////

function updateSwitchStatus() { 
// Update switchStatus array with current switch positions
		for (var i=0; i<50; i++) { 
			switchStatus[i] = $( "#switch_" + i ).val();
		};
		sendSwitchStatus();
		logSwitchStatus();
}

function sendSwitchStatus() {
//Send switch status to socket server
//This could probably be done better--without JSON stringifying the array
    var switchJson = JSON.stringify(switchStatus);
	socket.emit("updateHardwareSwitches",switchJson);
}

function logSwitchStatus() {
// Writes switchStatus array to javascript console
		for (var i=0; i<50; i++) { 
			console.log(switchStatus[i]);
		};
}