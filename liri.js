require("dotenv").config();

let keys = require('./keys')
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

let command = process.argv[2];
let look = "";
// grabbing all values after process.argv[2]
let nodeArgs = process.argv;
for (let i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        look = look + "+" + nodeArgs[i];
    } else {
        look += nodeArgs[i]
    }
}
// switch case in for process.argv[2] 
switch (command) {
    case "my-tweets":
        // function here
        tweetGrabber();
        break;
    case 'spotify-this-song':
        // function here
        songSpot();
        break;
    case 'movie-this':

        break;
    case 'do-what-it-says':

        break;

};

//tweet grabber currently not working, might have to wait for account to refresh
function tweetGrabber() {

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
    
    // console.log(look);
    spotify.search({ type: 'track', query: look, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // let artist = data.tracks.items.artists[0].name
        // console.log(data);
        let albumShort = data.tracks.items[0].album;
        let albumName = data.tracks.items[0].album.name;
        let songName = data.tracks.items[0].name;
        let preview = data.tracks.items[0].external_urls.spotify;
        let bandArray = [];
        // console.log(data.tracks.items[0].album.name)
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
    
}