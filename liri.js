// all of the requires for importing and npm packages
require("dotenv").config();

let keys = require('./keys')
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");
// creating data for keys for spotify and twitter with constructor from keys.js
let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);
// taking in the command from CLI
let command = process.argv[2];
// empty holding variable for 2+ word search items
let look = "";
// grabbing all values after process.argv[2]
let nodeArgs = process.argv;
function searchGrab() {
    for (let i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            look = look + "+" + nodeArgs[i];
        } else {
            look += nodeArgs[i]
        }
    }
}
// running the program with the switch cases
liri(command, look);
// function holding switch statement to define what is run with what keyword
function liri() {
    // switch case in for process.argv[2] 
    switch (command) {
        case "my-tweets":
            // function here
            tweetGrabber();
            break;
        case 'spotify-this-song':
            // function here
            if (look === "") {
                defaultSong();
            } else {
                songSpot();
            }
            break;
        case 'movie-this':
            // function here
            if (look === "") {
                defaultMovie();
            } else {
                movieSearch();
            }

            break;
        case 'do-what-it-says':
            // function here
            doIt();
            break;
        default:
            console.log('Wrong input');
    };
}

function tweetGrabber() {
    // get function from twitter npm grabbing tweets
    client.get('search/tweets', { q: 'InStaKur', count: 20 }, function (error, tweets, response) {
        if (error) console.log(error);
        // console.log(tweets);
        for (let i = 0; i < tweets.statuses.length; i++) {
            console.log(`${tweets.statuses[i].text} \n${tweets.statuses[i].created_at}`);
        }
    });
}

//function for spotify work
function songSpot() {
    //grabbing that multi word search
    searchGrab();

    let songParams = { type: 'track', query: look, limit: 1 };
    console.log(look);

    spotify.search(songParams, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        let albumShort = data.tracks.items[0].album;
        let albumName = data.tracks.items[0].album.name;
        let songName = data.tracks.items[0].name;
        let preview = data.tracks.items[0].external_urls.spotify;
        let bandArray = [];
        // for loop for pushing multiple member artists
        for (let i = 0; i < albumShort.artists.length; i++) {
            let bandName = data.tracks.items[0].album.artists[i].name;
            bandArray.push(bandName);
        }
        let prettyBand = bandArray.join(', ')
        console.log(`Artist(s): ${prettyBand} \nSong Name: ${songName} \nLink: ${preview} \nAlbum: ${albumName}`);
    });

}

//OMDB SEARCH 
function movieSearch() {
    //grabbing that multi word search
    searchGrab();
    
    // query url for api use taking in variables
    var queryUrl = "https://www.omdbapi.com/?t=" + look + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            console.log(`Title: ${JSON.parse(body).Title} \nYear Released: ${JSON.parse(body).Year} \nIMDB Rating: ${JSON.parse(body).imdbRating} \nRotten Tomatoes: ${JSON.parse(body).Ratings[1].Value} \nCountry Produced: ${JSON.parse(body).Country} \nLanguage: ${JSON.parse(body).Language} \nShort Plot: ${JSON.parse(body).Plot} \nActors: ${JSON.parse(body).Actors}`);
        }
    });

}

function doIt() {
    // reading the random text doc and grabbing the information and formatting to work with the main function containing switch statements
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error)
        }
        console.log(data);
        let dataArr = data.split(',');

        command = dataArr[0];
        look = dataArr[1];
        liri(command, look);
    })
}

//defaults
function defaultSong() {
    spotify.request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc').then(function(data){
        console.log(data.name)
        let songName = data.name;
        let band = data.album.artists[0].name;
        let albumName = data.album.name;
        let preview = data.preview_url;
        console.log(`Artist(s): ${band} \nSong Name: ${songName} \nLink: ${preview} \nAlbum: ${albumName}`);

    })
    
}
function defaultMovie() {
    var queryUrl = "https://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy";
    console.log(`If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/. \nIt's on Netflix!`)
    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            console.log(`Title: ${JSON.parse(body).Title} \nYear Released: ${JSON.parse(body).Year} \nIMDB Rating: ${JSON.parse(body).imdbRating} \nRotten Tomatoes: ${JSON.parse(body).Ratings[1].Value} \nCountry Produced: ${JSON.parse(body).Country} \nLanguage: ${JSON.parse(body).Language} \nShort Plot: ${JSON.parse(body).Plot} \nActors: ${JSON.parse(body).Actors}`);
        }
    });
}