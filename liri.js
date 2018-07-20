require("dotenv").config();

let keys = require('./keys')
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");

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
        movieSearch();
        break;
    case 'do-what-it-says':
        doIt()
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
    let songParams = "";
    // console.log(look);
    if (!process.argv[3]) {
        songParams = { type: 'track', query: 'The Sign', limit: 1 };
    } else {
        songParams = { type: 'track', query: look, limit: 1 };
    }
    console.log(look);
    
    spotify.search(songParams, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

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
    if(!nodeArgs[3]){
        look = 'Mr.Nobody';
        console.log(`If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/. \nIt's on Netflix!`)
    }
    var queryUrl = "https://www.omdbapi.com/?t=" + look + "&y=&plot=short&apikey=trilogy";

    // console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            console.log(`Title: ${JSON.parse(body).Title} \nYear Released: ${JSON.parse(body).Year} \nIMDB Rating: ${JSON.parse(body).imdbRating} \nRotten Tomatoes: ${JSON.parse(body).Ratings[1].Value} \nCountry Produced: ${JSON.parse(body).Country} \nLanguage: ${JSON.parse(body).Language} \nShort Plot: ${JSON.parse(body).Plot} \nActors: ${JSON.parse(body).Actors}`);
        }
    });

}

function doIt(){
    fs.readFile('random.txt', 'utf8', function(error, data){
        if(error) {
            return console.log(error)
        }
        console.log(data);
        let dataArr = data.split(',');
        console.log(dataArr)
    })
}