// io09K9l3ebJxmxe2 test SongKick API Key
var apiKey = "io09K9l3ebJxmxe2";
var todaysDate = moment().format("YYYY-MM-DD");
console.log(todaysDate);

var gps = '';



//songkick object for function storage

var songkick = {
  findCityGps: function(location){
      var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?query=" + location + "&apikey=io09K9l3ebJxmxe2";
      // var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?location=clientip&apikey=io09K9l3ebJxmxe2";


      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        // console.log(response);
        // store AJAX request data in a results variable
        var lat = response["resultsPage"]["results"]["location"][0]["metroArea"]["lat"];

        var long = response["resultsPage"]["results"]["location"][0]["metroArea"]["lng"];

        gps = lat + "," + long;
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
      var queryURL = "http://api.songkick.com/api/3.0/events.json?apikey=" + apiKey + "&location=" + gps + "&per_page=15" + "&min_date=" + todaysDate + "&max_date=" + todaysDate;


      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        console.log(response);
        console.log(response["resultsPage"]["results"]);

      });
      }

};

// Test Variables
var austinGPS = "30.3005,-97.7472";

songkick.findCityGps("austin");
songkick.findEvents(austinGPS);
//
// findCityGps = function(location){
//     var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?query=" + location + "&apikey=io09K9l3ebJxmxe2";
//     // var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?location=clientip&apikey=io09K9l3ebJxmxe2";
//
//
//     $.ajax({
//       url: queryURL,
//       method: 'GET'
//     }).then(function(response) {
//       console.log(response);
//       // store AJAX request data in a results variable
//       var metroId = response["resultsPage"]["results"]["location"][0]["metroArea"]["id"];
//       console.log(metroId);
//       return metroId
//
//     });
//     };
//
// // Test Variables
// var austin = findSKMetroId("austin");
// var austinGPS = "30.3190018,-97.7960005";
//
//
// // finds Events using GPS location for Today's Date
// findEvents = function(location){
//     // var metroId = metroId;
//
//     // Location needs to be in "lat,long" using positive and negative for north/south east/west
//     // var gps = location;
//
//     var gps = "geo:" + location;
//     // var queryURL = "http://api.songkick.com/api/3.0/events.json?" + metroId + "/calendar.json?apikey=io09K9l3ebJxmxe2";
//     var queryURL = "http://api.songkick.com/api/3.0/events.json?apikey=" + apiKey + "&location=" + gps + "&per_page=15" + "&min_date=" + todaysDate + "&max_date=" + todaysDate;
//
//
//     $.ajax({
//       url: queryURL,
//       method: 'GET'
//     }).then(function(response) {
//       console.log(response);
//       console.log(response["resultsPage"]["results"]);
//
//     });
//     };
