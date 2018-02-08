function searchBandsInTown(artist) {
    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // Printing the entire object to console
      console.log(response);
      // Constructing HTML containing the artist information
      var artistName = $("<h1>").text(response.name);
      var artistURL = $("<a>").attr("href", response.url).append(artistName);
      var artistImage = $("<img>").attr("src", response.thumb_url);
      var trackerCount = $("<h2>").text(response.tracker_count + " fans tracking this artist");
      var upcomingEvents = $("<h2>").text(response.upcoming_event_count + " upcoming events");
      var goToArtist = $("<a>").attr("href", response.url).text("See Tour Dates");
      // Empty the contents of the artist-div, append the new artist content
      $("#artist-div").empty();
      $("#artist-div").append(artistURL, artistImage, trackerCount, upcomingEvents, goToArtist);
    });
  }
  // Event handler for user clicking the select-artist button
  $("#select-artist").on("click", function(event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    var inputArtist = $("#artist-input").val().trim();
    // Running the searchBandsInTown function (passing in the artist as an argument)
    searchBandsInTown(inputArtist);
  });


// io09K9l3ebJxmxe2 test SongKick API Key
var apiKeySongKick = "io09K9l3ebJxmxe2";
var todaysDate = moment().format("YYYY-MM-DD");
console.log(todaysDate);

// google maps geolocation api AIzaSyCMYSEdplA8YCDESSjE-KxOji84lQjKNTU
var apiKeyGoogleGeoLocate = "AIzaSyCMYSEdplA8YCDESSjE-KxOji84lQjKNTU";

// google maps directions api AIzaSyCnd-IWrCKGW-QzK2iM3opYUL7Z_0gaR3A
var apiKeyGoogleDirections = "AIzaSyCnd-IWrCKGW-QzK2iM3opYUL7Z_0gaR3A";

// google maps distance matrix api AIzaSyC4VTDL8HDsd-eNs_89_lBzicvSKZAaWa0
var apiKeyGoogleMatrix = 'AIzaSyC4VTDL8HDsd-eNs_89_lBzicvSKZAaWa0';

// Global initialized Variables
//  - Songkick Variables-
var cityGPS = '';
var eventResults = [];
var destinationArr = [];

//  - Google Maps Variables -
var userGPS = {};
var distanceResults = [];


// google maps object for function storage

var googleMaps = {

  // Testing geolocation
  getLocation: function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(googleMaps.showPosition);
    }else{
      console.log("Location tracking not possible")
    };
    // var geo = new GeolocationSensor();
    //   geo.start();
    //
    //   geo.onreading = () => console.log(`lat: ${geo.latitude}, long: ${geo.longitude}`);
    //
    //   geo.onerror = event => console.error(event.error.name, event.error.message);
  },

  // This function is called automatically by the geolocation function to report the coordinates. Currently it saves to a global var and console.logs them.

    showPosition: function(position){
      userGPS = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,

        songKickStr:  position.coords.latitude + "," + position.coords.longitude,
        googleStr: position.coords.latitude + "%2C" + position.coords.longitude
      };
      // console.log("Latitude: " + position.coords.latitude "Longitude:" + position.coords.longitude );
    },

  // Update the global array of destiations with lng/lat/name objects using an array of events
  createDestinationArr: function(eventArr){
    destinationArr = [];

    for (var i = 0; i < eventResults.length; i++) {
      var destinationObj = {};
      destinationObj.lat = eventResults[i]["lat"];
      destinationObj.lng = eventResults[i]["lng"];
      destinationObj.name = eventResults[i]["venue"]["displayName"];

      destinationArr.push(destinationObj);
    };

    console.log(destinationArr);
  },
  // Queries Google Maps for distances between origin and all destinations in the given destination Array
  findDistance: function(origin, destinationArr){

      destinations = "";

      for (var i = 0; i < destinationArr.length; i++) {
        str = "";

        str += destinationArr[i]["lat"]
        str += "%2C"
        str += destinationArr[i]["lng"]
        str += "%7C"

        destinations += str;
      };
      // removes the last | for formatting the query correctly
      destinations = destinations.slice(0, -3);



      var origins = origin;

      console.log(destinations);


      var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + origins + "&destinations=" + destinations + "6&key=" + apiKeyGoogleMatrix;

      console.log(queryURL);

      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
          console.log(response);
          console.log(response["rows"]);
          console.log(response["rows"][0]["elements"]);
          // console.log(response["rows"][0]["elements"][0]["distance"]);
          // console.log(response["rows"][0]["elements"][0]["duration"]);

          var distanceArr = response["rows"][0]["elements"];
          distanceResults = [];
        // add the calculated distances and durations to our distance results
          for (var i = 0; i < distanceArr.length; i++) {
            var distanceObj = {};
            distanceObj.distance = distanceArr[i]["distance"];
            distanceObj.duration = distanceArr[i]["duration"];
            distanceResults.push(distanceObj);
          };
      // add the distance and duration properties to our destiationArr and eventResults array items

          for (var i = 0; i < distanceResults.length; i++) {
            destinationArr[i]["distance"] = distanceResults[i]["distance"];
            eventResults[i]["distance"] = distanceResults[i]["distance"];
            destinationArr[i]["duration"] = distanceResults[i]["duration"];
            eventResults[i]["duration"] = distanceResults[i]["duration"];
          };



        });

    },


};



//songkick object for function storage

var songkick = {

  // find GPS of a city using a search based on "cityname" string. Updates global var gps.
  findCityGps: function(location){
      var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?query=" + location + "&apikey=" + apiKeySongKick;
      // var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?location=clientip&apikey=io09K9l3ebJxmxe2";


      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        // console.log(response);
        // store AJAX request data in a results variable
        var lat = response["resultsPage"]["results"]["location"][0]["metroArea"]["lat"];

        var long = response["resultsPage"]["results"]["location"][0]["metroArea"]["lng"];

        cityGPS = lat + "," + long;
        console.log(cityGPS);
        // console.log(lat);
        // console.log(long);
        // console.log(gps.toString());

      });
    },




  // finds Events using GPS location for Today's Date
  findEvents: function(location){
      // var metroId = metroId;

      // Location needs to be in "lat,long" using positive and negative for north/south east/west
      // var gps = location;

      var gps = "geo:" + location;
      // var queryURL = "http://api.songkick.com/api/3.0/events.json?" + metroId + "/calendar.json?apikey=io09K9l3ebJxmxe2";
      var queryURL = "http://api.songkick.com/api/3.0/events.json?apikey=" + apiKeySongKick  + "&location=" + gps + "&per_page=15" + "&min_date=" + todaysDate + "&max_date=" + todaysDate;

      console.log(queryURL);
      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        console.log(response);
        console.log(response["resultsPage"]["results"]["event"]);

        var eventArr = response["resultsPage"]["results"]["event"];

        eventResults = [];

        for (var i = 0; i < eventArr.length; i++) {
          var eventObj = {};
          eventObj.name = eventArr[i]["displayName"];
          eventObj.lat = eventArr[i]["location"]["lat"];
          eventObj.lng = eventArr[i]["location"]["lng"];
          eventObj.startTime = eventArr[i]["start"]["time"];
          eventObj.date = eventArr[i]["start"]["date"];
          eventObj.uri = eventArr[i]["uri"];
          eventObj.performers = eventArr[i]["performance"];
          eventObj.venue = eventArr[i]["venue"];


          eventResults.push(eventObj)


        };

        console.log(eventResults);

      });
      }

};

// Test Variables
// var austinGPS = "30.3005,-97.7472";
//
// songkick.findCityGps("austin");
// disable this later - only for testing functions


// songkick.findEvents(austinGPS);
