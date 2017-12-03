// Configuration
const api_key = "<your google assistant api key>"
const domoticz_server = "http://<domoticz ip>:<port>"

const admin = require('firebase-admin')
const http = require('http')


var serviceAccount = require("<authentication file>");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://domoticz-3c33c.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref();


var lightsRef = ref.child(api_key+"/lights");
var initialized = false

lightsRef.on("value", function(snapshot) {	
	if (!initialized) {
		initialized = true // On initialization the changed method is called
		return
	}
	
	var lights = snapshot.val();
	
	// Loop through rooms
	for (var room in lights) {
		// Get the room data: {'ids':{0:2,1:30},state:"On"}
		var roomData = lights[room];
		// Get the state
		var state = roomData['state']
		// Get the group id's
		var ids = roomData['ids'];
		// Loop through the id keys
		for (idKey in ids) {
			// Get the id
			var id = ids[idKey];
			console.log('Turning '+state+' lights in the '+room+' with group id: '+id);
			// Tell the Raspberry Pi to send the request
			http.get(domoticz_server+'/json.htm?type=command&param=switchscene&idx='+id+'&switchcmd='+state, (resp) => {})
		}
	}
});
