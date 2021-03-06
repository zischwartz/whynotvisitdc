'use strict'
let fs = require('fs')
let dotenv = require('dotenv')
require('dotenv').config()
let later = require('later')
let _ = require('underscore')

later.date.localTime()

// let fs = require('fs')
// let sentiment = require('sentiment')
let build_image = require("./build_image.js")
let generator = require("./generator.js")
let post_to_twitter = require("./twitter.js")
// let post = require("./post.js")


// actually create a post
async function do_post(){
  let data = generator()
  let image_buffer = await build_image(data)
  // console.log(image)
  let text = _.sample(data['data'], 2).map(x=>x['cap']).join(' and ')
  // let text = "we have a nice convection oven and putin's bitch"
  let prefix = has_prefix(text) ? '' : _.sample(["we got ", "there's ", "see the ", "they have ", "we have ", "see "])
  text = `${data.meta.title}, ${prefix}${text}`
  console.log('going to post to twitter:')
  console.log(text)
  // leave it as buffer to simulate an error
  try_posting_a_tweet(text, image_buffer.toString('base64'))
  // post_to_twitter(text, image_buffer.toString('base64'))
  // .then(()=>console.log('done posting'))
}

// setup this thing
function activate_timer(){
  // do one post now now, for debug
  do_post()
  // let now = new Date()
  // console.log(now.toLocaleString())
  // off by one because DST? or no, later seems t work. specified in the dockerfile,
  // later seems to work, but date above is wrong by one
  // 7:35pm
  let textSched = later.parse.text('at 7:45am also at 4:22pm')
  var grand_timer = later.setInterval(do_post, textSched)
}

// and begin!
activate_timer()



// Helpers
//
//

// keep trying till it tweets, not that great, but I guess there's a built in timeout
async function try_posting_a_tweet(text, image_data, first_try=true){
  if (!first_try){
    // we could do something here to modify the tweet,
    // if we think maybe that's causing the error, like a dupe status
    console.log('Trying tweet again')
  }
  try {
    // normal case
    let r = await post_to_twitter(text, image_data)
  } catch (e) {
    console.log(e)
    //recursively try again
    await try_posting_a_tweet(text, image_data, false)
  }
}

// does this first caption already have a "see" etc? don't add one!
function has_prefix(text){
  let prefix_starts = ["we ", "there's ", "see ", "they "]
  for (let pre of prefix_starts ){ if (text.startsWith(pre)){ return true }  }
  return false
}

function coin_flip(){ return Math.random() < 0.5 ? false : true }
