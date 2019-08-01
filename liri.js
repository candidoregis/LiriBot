require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var axios = require("axios");
var fs = require("fs")

var spotify = new Spotify(keys.spotify);

var option = process.argv[2];
var term = process.argv.slice(3).join(" ");

switch (option) {
    case "concert-this":
        concertThis(term);
        return console.log("1");
        break;
    case "spotify-this-song":
        // function
        return console.log("2");
        break;
    case "movie-this":
        // function
        return console.log("3");
        break;
    case "do-what-it-says":
        // function
        return console.log("4");
        break;
}


function concertThis(artist) {

    axios
        .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("sucess");
            console.log(response.data[0]);
        })
        .catch(function (error) {
            console.log("failure");
            console.log(error.config);
        });
}


console.log(option);
// console.log(term);