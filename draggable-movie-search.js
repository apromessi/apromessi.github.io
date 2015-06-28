//
// // Set the center as Firebase HQ
var locations = {
  "center": [37.7686922,-122.4417199],
};
var center = locations.center;

// Query radius
var radiusInKm = 0.5;

// Get a reference to the Firebase public transit open data set
var transitFirebaseRef = new Firebase("https://fiery-fire-3549.firebaseio.com/")

// Create a new GeoFire instance, pulling data from the public transit data
var geoFire = new GeoFire(transitFirebaseRef.child("geofire"));

/*************/
/*  GEOQUERY */
/*************/
// Keep track of all of the vehicles currently within the query
var moviesInQuery = {};

// Create a new GeoQuery instance
var geoQuery = geoFire.query({
  center: center,
  radius: radiusInKm
});


/* Adds new vehicle markers to the map when they enter the query */
geoQuery.on("key_entered", function(id, latLng) {

      moviesInQuery[id] = 'pending'

      transitFirebaseRef.child("transformed-data3").child(id).on("value", function(snap){

      if (moviesInQuery[id] == 'pending') {
        var createdMarker = createVehicleMarker({lat:latLng[0], lon:latLng[1], movieName: snap.val().movieName,
          year: snap.val().year, director: snap.val().director, imgLink: snap.val().imgLink});
        moviesInQuery[id] = createdMarker
      }
      else {
        console.log("Already exist");
      }

      });
});

/* Removes vehicle markers from the map when they exit the query */

geoQuery.on("key_exited", function(id, latLng) {
  // Get the vehicle from the list of vehicles in the query
  // transitFirebaseRef.child("transformed-data3").child(id).on("value", function(snap){
  //   movies = snap.val();
  //   var movie = {lat:latLng[0], lon:latLng[1]};
  //
  //
  // });
  if (moviesInQuery[id]) {
    if (moviesInQuery[id].setMap) {
      moviesInQuery[id].setMap(null);
    }

    // Remove the vehicle from the list of vehicles in the query
    delete moviesInQuery[id];
    console.log(moviesInQuery)
  }

  else {
    console.log("Not being removed");
  }

});



/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
/* Adds a marker for the inputted vehicle to the map */
function createVehicleMarker(movie) {
  console.log("Movie: " + JSON.stringify(movie));


  if (movie.imgLink) {
    var marker = new google.maps.Marker({
      icon: new google.maps.MarkerImage(movie.imgLink, undefined, undefined, undefined, new google.maps.Size(50,50)),
      // icon:'"<div>" + movie.movieName + "</div>"',
      position: new google.maps.LatLng(movie.lat, movie.lon),
      optimized: true,
      map: map
    });
  }

  else {
    var marker = new google.maps.Marker({
      icon: new google.maps.MarkerImage('http://imagine.inrialpes.fr/people/Damien.Rohmer/documents/publications/10_sigasia_wrinkle/thumbnail/thumbnail_movie.png', undefined, undefined, undefined, new google.maps.Size(50,50)),
      // icon:'"<div>" + movie.movieName + "</div>"',
      position: new google.maps.LatLng(movie.lat, movie.lon),
      optimized: true,
      map: map
    });
  }


    return marker;


}

/* Returns a blue color code for outbound vehicles or a red color code for inbound vehicles */
function getVehicleColor(vehicle) {
  return ((vehicle.dirTag && vehicle.dirTag.indexOf("OB") > -1) ? "50B1FF" : "FF6450");
}

/* Returns true if the two inputted coordinates are approximately equivalent */
function coordinatesAreEquivalent(coord1, coord2) {
  return (Math.abs(coord1 - coord2) < 0.000001);
}

/* Animates the Marker class (based on https://stackoverflow.com/a/10906464) */
google.maps.Marker.prototype.animatedMoveTo = function(newLocation) {
  var toLat = newLocation[0];
  var toLng = newLocation[1];

  var fromLat = this.getPosition().lat();
  var fromLng = this.getPosition().lng();

  if (!coordinatesAreEquivalent(fromLat, toLat) || !coordinatesAreEquivalent(fromLng, toLng)) {
    var percent = 0;
    var latDistance = toLat - fromLat;
    var lngDistance = toLng - fromLng;
    var interval = window.setInterval(function () {
      percent += 0.01;
      var curLat = fromLat + (percent * latDistance);
      var curLng = fromLng + (percent * lngDistance);
      var pos = new google.maps.LatLng(curLat, curLng);
      this.setPosition(pos);
      if (percent >= 1) {
        window.clearInterval(interval);
      }
    }.bind(this), 50);
  }
};
