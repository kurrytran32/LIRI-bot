require("dotenv").config();

let spotify = new Spotify('../../keys.spotify');
let client = new Twitter('../../keys.twitter');

let command = process.argv[2];
let search = process.argv[3];

// switch case in for process.argv[2] 
switch (command) {
    case "my-tweets":
        // function here

        break;
    case 'spotify-this-song':
        // function here

        break;
    case 'movie-this':

        break;
    case 'do-what-it-says':

        break;
    
};

//tweet grabber
function tweetGrabber(){
    
}