// io09K9l3ebJxmxe2 test SongKick API Key
var apiKeySongKick = "io09K9l3ebJxmxe2";
var todaysDate = moment().format("YYYY-MM-DD");
console.log(todaysDate);

// google maps geolocation api AIzaSyCMYSEdplA8YCDESSjE-KxOji84lQjKNTU
var apiKeyGoogleGeoLocate = "AIzaSyCMYSEdplA8YCDESSjE-KxOji84lQjKNTU";

// google maps directions api AIzaSyCnd-IWrCKGW-QzK2iM3opYUL7Z_0gaR3A
var apiKeyGoogleDirections = "AIzaSyCnd-IWrCKGW-QzK2iM3opYUL7Z_0gaR3A";

var cityGPS = '';



//songkick object for function storage

var songkick = {

  // find GPS of a city using a search based on "cityname" string. Updates global var gps.
  findCityGps: function(location){
      var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?query=" + location + apiKeySongKick;
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
