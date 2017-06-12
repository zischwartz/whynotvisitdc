'use strict'
let fs = require('fs')
let request = require('request')
let Scraper = require('images-scraper')
let throttledRequest = require('throttled-request')(request);

throttledRequest.configure({
  requests: 5,
  milliseconds: 1000
});

// XXX should all be in one place, make sure this matches
let people = ["Donald Trump", "Sarah Huckabee Sanders", "Mike Pence", "Sean Spicer", "Kellyanne Conway", "Steve Bannon", "Jared Kushner", "Ivanka Trump", "Mitch McConnell", "Paul Ryan", "Rex Tillerson", "Sebastian Gorka", "Jeff Sessions", "Washington DC"]
// console.log(people[0].replace(/ /g, '_'))

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
  return new Promise((resolve, reject) => {
      // const file = fs.createWriteStream(filePath);
      let file = fs.createWriteStream(`./output/${term}.${ext}`)
      // console.log('.')
      request(url).on('error', (e)=> console.log('e')).pipe(file)
      // request(url, {timeout: 1500}).pipe(file)
      // file.end()
      file.on("finish", () => { resolve(true) });
  });
  // request(url).pipe(fs.createWriteStream(`./output/${term}.${ext}`))
  // request(url).pipe(fs.createWriteStream(`./output/${term}.${ext}`))
}

async function get_for_term(term){
  console.log(`Getting Images For: ${term}`)
  let list = await get_image_urls(term)
  // doh this needs to return when all done.
  // and this is where you could put a delay. or just use request throttle
  let ps = list.map( (hit, i)=> download_file(hit["url"], `${term} ${i}`, hit["format"]))
  return Promise.all(ps)
  // return await list.forEach( async (hit, i)=> await download_file(hit["url"], `${term} ${i}`, hit["format"]))
  // download_file(urls[9], term)
}

async function start(arr){
  for (let term of arr ){
    await get_for_term(term)
  }
  console.log('Done!')
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
