// IMPORTING DEPENDENCIES
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var axios = require("axios");
var fs = require("fs")

var spotify = new Spotify(keys.spotify);

// RETRIEVING PARAMETERS
var option = process.argv[2];
var term = process.argv.slice(3).join(" ");

// EXECUTE FUNCTION ACCORDINGLY TO WHAT HAS BEEN ENTERED
switch (option) {
    case "concert-this":
        concertThis(term);
        break;
    case "spotify-this-song":
        spotifyThisSong(term);
        break;
    case "movie-this":
        movieThis(term);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Please, enter a valid request. See you next time!")
}


// FUNCTION THAT RETURNS THE CONCERT INFORMATION ABOUT THE ARTIST ENTERED
function concertThis(artist) {

    var description = "The next concert of " + artist.toUpperCase() + " is:\n\n";

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {

            var divider = "\n------------------------------------------------------------\n\n";
            var data = response.data;
            var concertData;

            // If data comes empty
            if (data == 0) {  //need to review this one
                concertData = "There's no concert scheduled yet.\n";
            } else {
                var date = data[0].datetime;
                var format = "YYYY-MM-DDThh:mm:ss";
                var convertedDate = moment(date, format);

                // Creating a variable with all data required to use on print/save
                concertData = [
                    "\tVenue Name: " + data[0].venue.name,
                    "\tVenue Location: " + data[0].venue.city + ", " + data[0].venue.region,
                    "\tEvent Date: " + convertedDate.format("MM/DD/YYYY")
                ].join("\n");
            }

            // Saving data in file
            fs.appendFile("log.txt", divider + description + concertData + "\n", function (err) {
                console.log(divider + description + concertData + "\n");
                if (err) throw err;
            });
        })
        .catch(function (error) {
            console.log(error.config);
        });

}

// FUNCTION THAT RETURNS THE INFORMATION ABOUT THE SONG ENTERED
function spotifyThisSong(song) {

    var description;

    // In case of empty music, it will use this one as default
    if (song === "") {
        song = "the sign ace of base"; //just the sign is returning another artist
        description = "The information about the music THE SIGN is here:\n\n";
    } else {
        description = "The information about the music " + song.toUpperCase() + " is here:\n\n";
    }

    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {

            var divider = "\n------------------------------------------------------------\n\n";
            var data = response.tracks.items;
            var songData;

            if (data == 0) {  //need to review this one
                songData = "There's no music like this.\n";
            } else {

                // Creating a variable with all data required to use on print/save
                songData = [
                    "\tArtists: " + data[0].artists[0].name,
                    "\tSong Name: " + data[0].name,
                    "\tAlbum Name: " + data[0].album.name,
                    "\tSong Preview Link: " + data[0].external_urls.spotify
                ].join("\n");
            }

            // Saving data in file
            fs.appendFile("log.txt", divider + description + songData + "\n", function (err) {
                console.log(divider + description + songData + "\n");
                if (err) throw err;
            });

        })
        .catch(function (err) {
            console.log(err);
        });

}

// FUNCTION THAT RETURNS THE INFORMATION ABOUT THE MOVIE ENTERED
function movieThis(movie) {
    
    // In case of empty movie, it will use this one as default
    if (movie === "") {
        movie = "Mr. Nobody";
    }

    var description = "These are the information about the movie " + movie.toUpperCase() + ":\n\n";

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {

            var divider = "\n------------------------------------------------------------\n\n";
            var data = response.data;
            var movieData;

            // If data comes empty
            if (data == 0) {  //need to review this one
                movieData = "There's no movie like this.\n";
            } else {

                // To get the data from Rotten Tomatoes
                var rottenTomatoes = "";

                for (var i = 0; i < data.Ratings.length; i++) {
                    if (data.Ratings[i].Source == "Rotten Tomatoes") {
                        rottenTomatoes = data.Ratings[i].Value;
                    }
                }

                // Creating a variable with all data required to use on print/save
                movieData = [
                    "\tMovie: " + data.Title,
                    "\tYear Released: " + data.Year,
                    "\tiMDB Rating: " + data.imdbRating,
                    "\tRotten Tomatoes Rating: " + rottenTomatoes,
                    "\tCountry: " + data.Country,
                    "\tLanguage: " + data.Language,
                    "\tActors: " + data.Actors,
                    "\tPlot: " + data.Plot
                ].join("\n");
            }

            // Saving data in file
            fs.appendFile("log.txt", divider + description + movieData + "\n", function (err) {
                console.log(divider + description + movieData + "\n");
                if (err) throw err;
            });

        })

        .catch(function (error) {
            if (error.response) {
                console.log(error.response);
            }
        });
}

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        switch (dataArr[0]) {
            case "concert-this":
                concertThis(dataArr[1]);
                break;
            case "spotify-this-song":
                spotifyThisSong(dataArr[1]);
                break;
            case "movie-this":
                movieThis(dataArr[1]);
                break;
        }

    });

}
