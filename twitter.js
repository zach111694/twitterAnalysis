var Twitter = require('twitter');
var resources = require("./resources/twitter_api_keys.json");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tweets.db');
 
// INSERT YOUR API KEYS IN JSON FILE IN REOSURCES FOLDER
var client = new Twitter({
  consumer_key: resources.consumer_key,
  consumer_secret: resources.consumer_secret,
  access_token_key: resources.access_token_key,
  access_token_secret: resources.access_token_secret
});

// TWITTER API METHODS
// https://dev.twitter.com/rest/reference

// NPM SQLITE3 DOCS
// https://www.npmjs.com/package/sqlite3
// https://github.com/mapbox/node-sqlite3/wiki/API - This is more useful
// https://github.com/mapbox/node-sqlite3/wiki/Control-Flow
// 
// SQLITE3 DESKTOP CLIENT
// http://sqlitebrowser.org/

// NPM TWITTER DOCS
// https://www.npmjs.com/package/twitter

var params = {
  language: 'en',
  track: 'trump'
};


client.stream('statuses/filter', params, function(stream) {
  stream.on('data', function(event) {
    console.log("=====================================\n" + 
                "screen_name: " + event.user.screen_name + "\n" +
                "name: " + event.user.name + "\n" +
                "tweet: " + event.text
                );

    // insertToDB(event);

  });

  stream.on('error', function(error) {
    throw error;
  });
});

function insertToDB(twitterData){
  db.run("INSERT INTO tweets (`screen_name`,`name`,`tweet`) VALUES ($screen_name,$name,$tweet)",{
    $screen_name: twitterData.user.screen_name,
    $name: twitterData.user.name,
    $tweet: twitterData.text
  });
}

function printData(){
  db.all("SELECT * FROM tweets",function(err,rows){
    if(err){
      return err;
    }
    for(var i in rows){
      console.log("=======================================================\n" + 
        "screen_name: " + rows[i].screen_name + "\n" + 
        "tweets: " + rows[i].tweet
      );
    }
  });
}

// printData();

// RANDOM PUBLIC TWEETS

// client.get('statuses/sample', params, function(error, tweets, response) {
//   if (!error) {
//     console.log(tweets);
//    // for(var i in tweets){
//    //  console.log(tweets[i].text);
//    //  console.log("==================================================================");
//    // }
   
//   }
// });