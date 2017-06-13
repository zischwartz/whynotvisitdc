// 'use strict'
let fs = require('fs')

console.log(process.env)
// let dotenv = require('dotenv')
// require('dotenv').config()


let Twit = require('twit')
let _ = require('underscore')
// let request = require('request')
// let RP = require('request-promise-native')


// console.log(process.env)

var T = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
  timeout_ms:           5*60*1000,  // optional HTTP request timeout to apply to all requests.
})

let promisify = fn => (...args) =>
    new Promise((resolve, reject) =>
        fn(...args, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    );


// For Posting
// =============================================================================
// =============================================================================

// function post_a_tweet(tweet, image_data, cb){
//   post_media_and_tweet(text, image_data, cb)
//   // post_media_and_tweet(text, new Buffer(image_data).toString('base64'), cb)
// } // end post_a_tweet
//

function post_media_and_tweet(text, image_data, cb) {
// XXX got { errors: [ { code: 32, message: 'Could not authenticate you.' } ] }
// somewhere in here, it may have to retry, the ball bounce bot did that awkardly hm
  // image_data = new Buffer(image_data).toString('base64')
  // seems to work
  // var b64content = fs.readFileSync('/path/to/img', { encoding: 'base64' })

  // first we must post the media to Twitter
  T.post('media/upload', { media_data: image_data }, function (err, data, response) {
    if(err){console.log('up err', err)}
  // T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    // console.log(data)

    // XXX this can just fail, and work on retry IIRC
    // if there's an error here, just run the post_media_and_tweet again? (and don't do the other stuff, an else)
    // that worked for the other, though I was chunking..
    var mediaIdStr = data.media_id_string
    var altText = text // "Small flowers in a planter on a sunny balcony, blossoming."
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if(err){console.log('create err', err)}
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        // var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }
        var params = { status: text, media_ids: [mediaIdStr] }
        // T.post('statuses/update', params, function (err, data, response) {
        T.post('statuses/update', params, cb)
      }
    }) // end meta create
  })

}

module.exports = promisify(post_media_and_tweet)
