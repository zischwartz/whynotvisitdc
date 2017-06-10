let fs = require('fs')
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
// console.log(human_descriptions)

// who needs the long ones ? not me
honorifics = honorifics.filter(x=>x.split(' ').length <= 3)

// use this to get all image files.
let all_image_files = fs.readdirSync('./src/images/')
// all_photos = all_photos.filter( f=>f.indexOf('.ttf')!=-1)
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
  if (_.uniq(shorter).length <6) {return false}
  if (!_.contains(shorter, "Donald Trump".substring(0,6))) {return false}
  // not the same, first 7 chars
  // has trump
}

// console.log(image_picker())

// helper, coin flip
function flip(){ return Math.random() < 0.5 ? false : true }

// Captions
let general_prefixes = ["we got ", "there's ", "see the ", "they have ", ""]


function top_left(){
  let a = _.sample(general_prefixes)
  let b = _.sample(nsa_projects)
  return `${a}${b.toLowerCase()}`
  // console.log(flip())
}

function top_middle(){
  let a = _.sample(human_descriptions)
  let b = flip() ? _.sample(condiments) : _.sample(vegetables)
  return `${a} ${b.toLowerCase()}`
}

function top_right(){
  let a =_.sample(agencies).toLowerCase()
  a = a.split(' ')
  a.pop()
  // coinflip if we should remove some stop words
  if (flip()){ a = _.without(a, "of", "the", "on", "and") }
  if (a.length > 3) { a.pop() }
  a = a.join(' ')
  return a
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
  // console.log(a,b)
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

function make_six(){
  return [top_left(), top_middle(), top_right(), bottom_left(), bottom_middle(), bottom_right()]
}

console.log(make_six())
