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
// let tv_shows = require('corpora/data/film-tv/tv_shows')['tv_shows']
let appliances = require('corpora/data/technology/appliances')['appliances']
let objects = require('corpora/data/objects/objects')['objects']
let moods = require('corpora/data/humans/moods')['moods']
let biases = require('corpora/data/words/cognitive_biases')['cognitive_biases']

let {trump_nicks, jared_nicks, bannon_nicks, sean_nicks} = require('./jokes.js')

// who needs the long ones ? not me
honorifics = honorifics.filter(x=>x.split(' ').length <= 3)

// console.log(nsa_projects.length)
nsa_projects = nsa_projects.filter(x=> sentiment(x)['comparative'] <= 0 )
// console.log(nsa_projects.length)
// console.log(sentiment("elfin squash"))

// Caption generators
//
// ---------------------------------------------
function gen_see_nsa_project(){
  // add expletive TODO
  let prefixes = ["we got ", "there's ", "see the ", "they have ", "see "]
  let a = _.sample(prefixes)
  let b = _.sample(nsa_projects)
  return `${a}${b.toLowerCase()}`
}

function gen_fn_monster(){
  let a = _.sample(monsters)
  let b = _.sample(first_names)
  return `${a.toLowerCase()} ${b.toLowerCase()}`
}

function gen_hon_animal(){
  let a = _.sample(honorifics)
  let b = _.sample(animals)
  b = b.charAt(0).toUpperCase() + b.slice(1)
  return `${a} ${b}`
}

function gen_see_object(){
    let prefixes = ["we got a ", "there's a ", "we have a nice ", "see our new "]
    let a = _.sample(prefixes)
    let b = _.sample(appliances)
    return `${a}${b}`
}

function gen_cogbias(){
    // let prefixes = ["we got a ", "there's a ", "a nice ", "see our new "]
    let a = _.sample(biases)
    return `${a.toLowerCase()}`
}

// recurse till sentiment of 0 or below
function gen_hd_plus_food(){
  let a = _.sample(human_descriptions)
  let b = coin_flip() ? _.sample(condiments) : _.sample(vegetables)
  let res =  `${a} ${b.toLowerCase()}`
  return (sentiment(res)['comparative'] > 0) ? gen_hd_plus_food(): res
}

// recurse till sentiment of 0 or below
function gen_mood_plus_object(){
  let a = _.sample(moods)
  let b =  _.sample(objects)
  let res = `${a} ${b.toLowerCase()}`
  return (sentiment(res)['comparative'] > 0) ? gen_mood_plus_object(): res
}

class CapList {
  constructor(){
    this.all = _.shuffle([
      gen_mood_plus_object(),
      gen_cogbias(),
      gen_hd_plus_food(),
      gen_fn_monster(),
      gen_hon_animal()])
      // ,gen_see_object(), gen_see_nsa_project(), // these are now for dc

  }
  get(){
    return this.all.pop()
  }
}


// Main function - actually generate it, what we export
//
//
function generate(){
  let result = []
  // so we don't repeat genres of generics
  let caplist = new CapList()
  // let captions = [top_left(), top_middle(), top_right(), bottom_left(), bottom_middle(), bottom_right()]
  let images = image_picker()
  // setup
  let captions = images.map(x=>false)

  //
  let donald_index = _.findIndex(images, (x)=>x.indexOf('Donald')!=-1 )
  captions[donald_index] = _.sample(trump_nicks)
  // console.log(captions)
  let jared_index = _.findIndex(images, (x)=>x.indexOf('Jared')!=-1 )
  let bannon_index = _.findIndex(images, (x)=>x.indexOf('Bannon')!=-1 )
  let sean_index = _.findIndex(images, (x)=>x.indexOf('Sean')!=-1 )
  let guys = [
    {i:jared_index, cap: _.sample(jared_nicks)},
    {i:bannon_index, cap: _.sample(bannon_nicks)},
    {i:sean_index, cap:_.sample(sean_nicks)}
  ]
  guys = guys.filter(x=> x['i']!=-1)
  let other = _.sample(guys)
  //apply it
  if (other){ captions[other.i] = other['cap'] }

  let dc_index = _.findIndex(images, (x)=>x.indexOf('Washington')!=-1 )
  //apply it
  if (dc_index!=-1) {
     captions[dc_index]= coin_flip() ? gen_see_object(): gen_see_nsa_project()
   }

  captions = captions.map(x=>{
    if (x) {return x}
    else {return caplist.get()}
  })
  // console.log(captions)




  // captions[donald_index] = _.sample(trump_nicks)
  // jared_nicks, bannon_nicks, sean_nicks

  // TODO
  // done with specific stuff people, fill it up



  // make a nice results array
  captions.forEach( (cap,i)=>{ result.push({cap, image_name:images[i]}) })
  let title  = _.sample(["Why not visit Washington D.C.?", "Come on down to the District of Columbia", "Maybe stop by D.C. sometime"])
  let meta = {title}
  // console.log(result)
  // todo, all randomness here?
  return {data:result, meta}
}

// HELPERS
//
//
// 50-50 shot, returns boolean
function coin_flip(){ return Math.random() < 0.5 ? false : true }

// use this to get all image files.
let all_image_files = fs.readdirSync('./src/images/')
// console.log(all_image_files.length)
all_image_files = all_image_files.filter( f=>f.indexOf('.png')!=-1)

// Helper for generate above, used for picking images obvs
// recurse till meets criteria
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

module.exports = generate

// console.log(generate())
