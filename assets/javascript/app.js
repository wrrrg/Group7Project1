// io09K9l3ebJxmxe2 test SongKick API Key
var apiKey = io09K9l3ebJxmxe2;
var todaysDate = moment().format("YYYY-MM-DD");

http://api.songkick.com/api/3.0/metro_areas/{metro_area_id}/calendar.json?apikey={your_api_key}

// Query songkick

findSKMetroId = function(location){
    var gps = location;
    var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?query=" + location + "&apikey=io09K9l3ebJxmxe2";
    // var queryURL = "http://api.songkick.com/api/3.0/search/locations.json?location=clientip&apikey=io09K9l3ebJxmxe2";


    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response);
      // store AJAX request data in a results variable
      var metroId = response["resultsPage"]["results"]["location"][0]["metroArea"]["id"];
      console.log(metroId);
      return metroId

    });
    };

findEvents = function(location){
    // var metroId = metroId;
    var gps = location;
    // var queryURL = "http://api.songkick.com/api/3.0/events.json?" + metroId + "/calendar.json?apikey=io09K9l3ebJxmxe2";
    var queryURL = "http://api.songkick.com/api/3.0/events.json?apikey=" + apiKey + "&location=" + location + "&min_date=" + todaysDate + "&per_page=15";


    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response);
      console.log(response["resultsPage"]["results"]

    });
    };
