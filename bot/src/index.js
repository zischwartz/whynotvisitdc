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



async function activate(){
  let data = generator()
  let image_buffer = await build_image(data)
  // console.log(image)
  let text = _.sample(data['data'], 2).map(x=>x['cap']).join(' and ')
  // let text = "we have a nice convection oven and putin's bitch"
  let prefix = has_prefix(text) ? '' : _.sample(["we got ", "there's ", "see the ", "they have ", "we have ", "see "])
  text = `${data.meta.title}, ${prefix}${text}`
  console.log('going to post to twitter')
  console.log(text)
  post_to_twitter(text, image_buffer.toString('base64'))
  // .then(()=>console.log('done posting'))
}

activate()

// console.log(data)

// helpers
// does this first caption already have a "see" etc? don't add one!
function has_prefix(text){
  let prefix_starts = ["we ", "there's ", "see ", "they "]
  for (let pre of prefix_starts ){ if (text.startsWith(pre)){ return true }  }
  return false
}

function coin_flip(){ return Math.random() < 0.5 ? false : true }
