require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var spotifyKeys = keys.spotify;
var twitterKeys = keys.twitter;
var fs = require("fs");
var userChoice = process.argv[2];
var userInput = process.argv[3];
var Spotify = require("node-spotify-api");
var twitter = require("twitter");

switch (userChoice) {
    case "spotify-this-song":
        spotifySearch();
        break;

    case "movie-this":
        movieSearch();
        break;

    case "my-tweets":
        myTweets();
        break;

    case "do-what-it-says":
        doIt();
        break;

}




function spotifySearch(pick) {
    if (userInput === undefined && pick === undefined) {
        var song = "The Sign";
    }
    else if (userInput != undefined) {
        var song = userInput;
    }
    else {
        var song = pick;
    }
    var spotify = new Spotify(spotifyKeys);
    console.log(song);
    spotify.search({ type: 'track', query: song, limit: 15}, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var items = data.tracks.items;
        var count = 0;
        for (var i = 0; i < items.length; i++) {
            var artistName = items[i].album.artists[0].name;
            var link = items[i].album.href;
            var albumName = items[i].album.name;
            var songName = items[i].name;
            var songNameCaps = songName.toUpperCase();
            var songCaps = song.toUpperCase();
            if (songNameCaps === songCaps && count === 0) {
                console.log("The Artist name is " + artistName);
                console.log("The title of the Song is " + songName);
                console.log("The album the song is in is " + albumName);
                console.log("Preview Link for the Song " + link);
                count++;
            };
        };
    });
};
function movieSearch() {
    if (userInput != undefined) {
        var movieName = userInput;
    }
    else {
        var movieName = "Mr. Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var info = JSON.parse(body);
            console.log("The " + info.Ratings[1].Source + " Rating is a " + info.Ratings[1].Value);
            console.log("The title of the movie is " + info.Title);
            console.log("The movie was released in " + info.Year);
            console.log("The Imdb Rating is " + info.imdbRating);
            console.log("The movie was produced in " + info.Country);
            console.log("The movie is available in the following languages " + info.Language);
            console.log("The Plot of the movie is " + info.Plot);
            console.log("The following actors are in the movie " + info.Actors);
        }
        else {
            console.log(error);
        };
    });
};
function myTweets() {
    if (userInput != undefined) {
        var userName = userInput;
    }
    else {
        var userName = "kevgod88";
    }
    var client = new twitter(twitterKeys);
    var params = { screen_name: userName, maxResults: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                console.log(JSON.stringify(tweets[i].created_at, null, 2));
                console.log(JSON.stringify(tweets[i].text, null, 2));
            };
        }
        else {
            console.log(error);
        };
    });
};
function doIt() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var array = data.split(",");
        var choice = array[0];
        var picks = array[1];
        var pick = picks.slice(1,-1);
        switch (choice) {
            case "spotify-this-song":
                spotifySearch(pick);
                break;

            case "movie-this":
                movieSearch(pick);
                break;

            case "my-tweets":
                myTweets(pick);
                break;


        };

    });
};