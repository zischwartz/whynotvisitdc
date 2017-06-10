'use strict'
let fs = require('fs')
let request = require('request')
let Scraper = require('images-scraper')


let people = ["Donald Trump", "Sarah Huckabee Sanders", "Mike Pence", "Sean Spicer", "Kellyanne Conway", "Steve Bannon", "Jared Kushner", "Ivanka Trump", "Mitch McConnell", "Paul Ryan", "Rex Tillerson", "Sebastian Gorka", "Jeff Sessions"]


// console.log(optional_people[0].replace(/ /g, '_'))

async function get_image_urls(term){
  let bing = new Scraper.Bing()
  let list = await bing.list({
      keyword: term,
      num: 15,
      detail: true
  })
  return list
  // return list.map(o=>o['url']) // thumb for small
}

function download_file(url, term, ext){
  // console.log("Downloading", url)
  // term = term.replace(/\//g, '_')
  term = term.replace(/ /g, '_')
  // let ext = url.split('.')[url.split('.').length-1]
  // console.log(ext)
  // if (ext.length>4){return false}
  console.log('.')
  request(url).pipe(fs.createWriteStream(`./output/${term}.${ext}`))
}

async function get_for_term(term){
  console.log(`Getting Images For: ${term}`)
  let list = await get_image_urls(term)
  list.forEach( (hit, i)=> download_file(hit["url"], `${term} ${i}`, hit["format"]))
  // download_file(urls[9], term)
}

async function start(arr){
  for (let term of arr ){
    await get_for_term(term)
  }
}

start(people)


// console.log(people.length)
// let t = "Sarah_Huckabee_Sanders_3.com/wp-content/uploads/201"
// console.log(t.replace(/\//g, '_'))

//
//
// let bing = new Scraper.Bing()
//
// bing.list({
//     keyword: 'trump',
//     num: 1,
//     detail: true
// })
// .then(function (res) {
//     console.log('first 10 results from bing', res);
// }).catch(function(err) {
//     console.log('err',err);
// })
