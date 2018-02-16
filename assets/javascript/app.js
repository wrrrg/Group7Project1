//  Dear Everyone Reading this - this is super busted right now, but it works. Basically the following functions have to happen in order for a sorted list of events based on the user's location to populate correctly

// 1) the user's location must be determined, either via location permissions or the address they enter in the location search.
// either of these functions (googleMaps.getLocation() or googleMaps.searchAddress()  ) will then use songkick.findEvents to track down the events on today's date near that area, capping it at 15 events. To do this, both the getLocation and the searchAddress functions will call songkick.findEvents at the end of their functions.

// Songkick then uses these new found events to query google maps to find out how far away each of them are. To do this, songkick.findEvents calls googleMaps.findDistance() at the end of it.

// We then want to sort the array so that the shortest distance appears first. We do this at the end of googleMaps.findDistance() by calling the sortDistance() function.

// We then want to append these results to the events-div. We do this by putting the appendEvents() function at the end of sortDistance().

// I know this is a super stupid way to do this, but I do not understand callbacks. If anyone can refractor, please please do.

function openNav() {
    document.getElementById("navSearch").style.height = "39%";
};

function closeNav() {
    document.getElementById("navSearch").style.height = "0%";
};



// event listeners jquery

$(document).ready(function() {
  // ask for GPS permission and use that
  $("#use-gps-button").on("click", function(){
      useGPS = true;
      googleMaps.getLocation();

    })
  // use the search field

  $("#submit-input").on("click", function(){
    useGPS = false;
    googleMaps.searchAddress();
  });
  $("#area-input").keypress( function(e){
    var key = e.which;

    if((key) === 13) {
      $("#submit-input").click();
  }});
  });




$(document).on("click", '.artist-click', function(){

    var artistQuery = this.text;
    console.log(artistQuery);
    $("#artist-input").val(artistQuery);

    searchBandsInTown(artistQuery);
  });




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
  // On input to search of artist, queries possible artists
  $("#artist-input").keyup(function(event) {

    // Preventing the button from trying to submit the form

    // Storing the artist name
    var inputArtist = $("#artist-input").val().trim();
    // Running the searchBandsInTown function (passing in the artist as an argument)
    if (event.keyCode == 13) {
      event.preventDefault();
      $("#select-artist").click();
      };

    searchBandsInTown(inputArtist);
  });

  //
  // $(".artist-click").on("click", function(){
  //   var artistQuery = this.text;
  //   console.log(artistQuery);
  //   $("#artist-input").val(artistQuery);
  //
  //   searchBandsInTown(artistQuery);
  // });


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

// geocoding

var apiKeyGoogleGeocode = 'AIzaSyBmoewIZls4DAoeu04S_WZ8r0dJ8bgTDek';
// Global initialized Variables
//  - Songkick Variables-
var cityGPS = '';
var eventResults = [];
var destinationArr = [];

//  - Google Maps Variables -
var userGPS = {};
  // from search box instead of location services
var userLocation = {};
var userAddress = '';
var distanceResults = [];

//  true false var for using GPS or address searching

var useGPS = false;


// google maps object for function storage

var googleMaps = {

  // Testing geolocation
  getLocation: function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(googleMaps.success);
        sortDistance(eventResults);
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

  // If we successfully get geolocation, this function automatically creates an eventResults array for the user's GPS, a destination array, and adds the durations/distances to the objects, then pulls them down.

    success: function(position, ){


      userGPS = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,

        songKickStr:  position.coords.latitude + "," + position.coords.longitude,
        googleStr: position.coords.latitude + "%2C" + position.coords.longitude
      };

      console.log("The string for songkick is: " + userGPS.songKickStr + " and the string for Google is: " + userGPS.googleStr);

      // This calls our findEvents function (which calls our findDistance function as well) to automatically get our array of events with necessary data upon finding the location.
      songkick.findEvents(userGPS.songKickStr);

    },


  // A function for when we need to search by the user's text field address input, since GPS was denied

  searchAddress: function(){
    var userAddress = $("#area-input").val();
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + userAddress + "&key=" + apiKeyGoogleGeocode;


    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
        console.log(response);

        userLocation = {
          lat: response["results"]["0"]["geometry"]["location"]["lat"],
          lng: response["results"]["0"]["geometry"]["location"]["lng"],
          name: response["results"]["0"]["formatted_address"],

          songKickStr: response["results"]["0"]["geometry"]["location"]["lat"] + "," + response["results"]["0"]["geometry"]["location"]["lng"],

          googleStr: response["results"]["0"]["geometry"]["location"]["lat"] + "%2C" + response["results"]["0"]["geometry"]["location"]["lng"]
        };

        songkick.findEvents(userLocation.songKickStr);
        console.log(userLocation);



  });
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
            distanceObj.address = response["destination_addresses"][i];
            distanceResults.push(distanceObj);
          };
      // add the distance and duration properties to our destiationArr and eventResults array items

          for (var i = 0; i < distanceResults.length; i++) {
            destinationArr[i]["distance"] = distanceResults[i]["distance"];
            // eventResults[i]["distance"] = distanceResults[i]["distance"];
            destinationArr[i]["duration"] = distanceResults[i]["duration"];
            // eventResults[i]["duration"] = distanceResults[i]["duration"];
            destinationArr[i]["address"] = distanceResults[i]["address"];
          };

        // sortDistance(distanceResults);
        sortDistance(destinationArr);


        });

    },


};



//songkick object for function storage

var songkick = {

  // find GPS of a city using a search based on "cityname" string. Updates global var gps.
  findCityGps: function(location){
      var queryURL = "https://api.songkick.com/api/3.0/search/locations.json?query=" + location + "&apikey=" + apiKeySongKick;
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
      var queryURL = "https://api.songkick.com/api/3.0/events.json?apikey=" + apiKeySongKick  + "&location=" + gps + "&per_page=15" + "&min_date=" + todaysDate + "&max_date=" + todaysDate;

      console.log(queryURL);
      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        console.log(response);
        console.log(response["resultsPage"]["results"]["event"]);

        var eventArr = response["resultsPage"]["results"]["event"];

        eventResults = [];
        source = '';

        if(useGPS) {
          source = userGPS.googleStr
        } else {
          source = userLocation.googleStr
        }

        for (var i = 0; i < eventArr.length; i++) {
          var eventObj = {};
          eventObj.name = eventArr[i]["displayName"];
          eventObj.startTime = eventArr[i]["start"]["time"];
          eventObj.lat = eventArr[i]["location"]["lat"];
          eventObj.lng = eventArr[i]["location"]["lng"];
          eventObj.date = eventArr[i]["start"]["date"];
          eventObj.uri = eventArr[i]["uri"];
          eventObj.performers = eventArr[i]["performance"];
          eventObj.venue = eventArr[i]["venue"];


          eventResults.push(eventObj)


        };
        googleMaps.findDistance(source, eventResults);
        console.log(eventResults);

      });

}};
// variable for the functions that populate our results

sortDistance = function(array){
    array.sort(function(a, b) {
      return parseFloat(a.distance.text) - parseFloat(b.distance.text);
    });
    console.log(array);
    console.log("sorted!");
    appendEvents(eventResults);
  };
sortDuration = function(array){
    array.sort(function(a, b) {
      return parseFloat(a.duration.text) - parseFloat(b.duration.text);
      });
    };
sortStartTime = function(array){
      array.sort(function(a, b) {
        return parseFloat(a.startTime) - parseFloat(b.startTime);
      });
    };

appendEvents = function(eventResults){

  // checks if we're using userGPS or userLocation for our links
  var origin = '';
  if(useGPS){
    origin = userGPS.googleStr;
  } else {
    origin = userLocation.googleStr;
  };

  $("#events-div").empty();

  // Loop through the results
  for (var i=0; i<eventResults.length; i++) {

    var artistArr = eventResults[i]["performers"];

    var artistList = ''

    for (var j = 0; j < artistArr.length; j++) {
           var artist = artistArr[j]["displayName"];
           var artistName = "<span class='artist-listing'><a href='#yourArtist' class='artist-click' >" + artist + "</a></span>";


           artistList = artistList + ", " + artistName;

    };

    console.log(artistList);



    var name = eventResults[i]["name"],
        link = eventResults[i]["uri"],
        eventStart = eventResults[i]["startTime"],
        eventDist = eventResults[i]["distance"]["text"],

        address = eventResults[i]["address"];

    // make the div element
    var eventDiv = $("<div class='event-div'>");
    // Event Name


    var eventName = $("<span class='name'>").html("<br/>"+ " "+ name + " " + " ");

    // start time (military for now, might change with moment)
    var start = $("<span class='start'>").html(" Start time: " + eventStart + " "+"<br/>");

    //  distance to the event
    var distance = $("<span class='distance'>").text("Distance " + eventDist+ " ");


    // link that opens google maps with directions
    var addressLink = "https://www.google.com/maps/dir/?api=1&origin=" + origin + "&destination=" +  eventResults[i]["lat"] + "%2C" + eventResults[i]["lng"];

    // uses the addressLink as the href= and the name of the address as the text


    var address = $("<a class='address-link'>").text(" " + address + " ").attr({
      href: addressLink,
      target: '_blank'
    });



    // More Details Link (Songkick)
    var songkickLink = $("<a class='more-info-link'>").text("Tickets").attr({
      href: link,
      target: '_blank'
    });


    // Append paragraph and image to div
    eventDiv.append(eventName);
    eventDiv.append(start);
    eventDiv.append(distance);
    eventDiv.append(songkickLink);
    eventDiv.append(address);
    eventDiv.append(artistList);


    // prepend the giphyDiv to the main images div
    $("#events-div").append(eventDiv);
  };
}
// Test Variables
// var austinGPS = "30.3005,-97.7472";
//
// songkick.findCityGps("austin");
// disable this later - only for testing functions



// songkick.findEvents(austinGPS);
