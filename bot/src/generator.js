let fs = require('fs')
let sentiment = require('sentiment')
let _ = require('underscore')
let nsa_projects = require('corpora/data/governments/nsa_projects')['codenames']
let human_descriptions = require('corpora/data/humans/descriptions')['descriptions']
let condiments = require('corpora/data/foods/condiments')['condiments']
let vegetables = require('corpora/data/foods/vegetables')['vegetables']
let honorifics = require('corpora/data/humans/englishHonorifics')['englishHonorifics']
let animals = require('corpora/data/animals/common')['animals']
let agencies = require('corpora/data/governments/us_federal_agencies')['agencies']
let monsters = require('corpora/data/mythology/monsters')['names']
let first_names = require('corpora/data/humans/firstNames')['firstNames']
let tv_shows = require('corpora/data/film-tv/tv_shows')['tv_shows']
let appliances = require('corpora/data/technology/appliances')['appliances']
let objects = require('corpora/data/objects/objects')['objects']
let moods = require('corpora/data/humans/moods')['moods']
// console.log(human_descriptions)

let trump_nicks = require('./jokes.js')
// console.log(trump_nicks.length)
// console.log(_.sample(trump_nicks))
// who needs the long ones ? not me
honorifics = honorifics.filter(x=>x.split(' ').length <= 3)

tv_shows = tv_shows.filter(x=> sentiment(x)['comparative'] <= 0 )
// console.log(nsa_projects.length)
nsa_projects = nsa_projects.filter(x=> sentiment(x)['comparative'] <= 0 )
// console.log(nsa_projects.length)


// use this to get all image files.
let all_image_files = fs.readdirSync('./src/images/')
// console.log(all_image_files.length)
all_image_files = all_image_files.filter( f=>f.indexOf('.png')!=-1)
// on node-canvas we need to call this first for each font we want to use

// recurse, so lazy
function image_picker(){
  let image_list = _.sample(all_image_files, 6)
  if (meets_criteria(image_list)) { return image_list }
  else                            { return image_picker() }
}

// returns true or false if our list meets muster
function meets_criteria(image_list){
  let shorter = image_list.map(x => x.substring(0,6))
  // not the same person twice, based on first 7 chars
  // has trump
  if (_.uniq(shorter).length <6) {return false}
  if (!_.contains(shorter, "Donald_Trump".substring(0,6))) {return false}
  return true
}

// console.log(image_picker())

// helper, coin flip
function flip(){ return Math.random() < 0.5 ? false : true }

// Caption generator

// recurse till sentiment of 0 or below
function top_left(){
  let a = _.sample(human_descriptions)
  let b = flip() ? _.sample(condiments) : _.sample(vegetables)
  let res =  `${a} ${b.toLowerCase()}`
  return (sentiment(res)['comparative'] > 0) ? top_middle(): res
}

function top_middle(){
  // add expletive TODO
  let prefixes = ["we got ", "there's ", "see the ", "they have ", "see"]
  let a = _.sample(prefixes)
  let b = _.sample(nsa_projects)
  return `${a}${b.toLowerCase()}`
}

// recurse till sentiment of 0 or below
function top_right(){
  let a = _.sample(moods)
  let b =  _.sample(objects)
  let res = `${a} ${b.toLowerCase()}`
  return (sentiment(res)['comparative'] > 0) ? top_right(): res
}

function bottom_left(){
  let a = _.sample(monsters)
  let b = _.sample(first_names)
  // console.log(a,b)
  return `${a.toLowerCase()} ${b.toLowerCase()}`
}

function bottom_middle(){
  let a = _.sample(honorifics)
  let b = _.sample(animals)
  b = b.charAt(0).toUpperCase() + b.slice(1)
  return `${a} ${b}`
}

function bottom_right(){
  if (flip()){
    let prefixes = ["we got a ", "there's a ", "a nice ", "see our new "]
    let a = _.sample(prefixes)
    let b = _.sample(appliances)
    return `${a}${b}`
  } else {
    return _.sample(tv_shows).toLowerCase()
  }
}

// console.log(bottom_right())

function generate(){
  let result = []
  let captions = [top_left(), top_middle(), top_right(), bottom_left(), bottom_middle(), bottom_right()]
  let images = image_picker()
  // if (flip()){
  // but also, do this earlier, only replace the worse captions (keep monster, )
  // TODO
  if (true){
    let i = _.findIndex(images, (x)=>x.indexOf('Donald')!=-1 )
    captions[i] = _.sample(trump_nicks)
  }
  // make a nice results array
  captions.forEach( (caption,i)=>{
    result.push({caption, image_name:images[i]})
  })
  return result
}

module.exports = generate

// console.log(generate())
