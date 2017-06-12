let fs = require('fs')
let path = require('path')
let stream = require('stream')
let Canvas = require('canvas')
let _ =  require('underscore')
let uuidV4 = require('uuid/v4')
let randomColor = require('random-color')

Image = Canvas.Image

// WIP
// WIP

let post_image_dims= {
  width:900,
  height:600,
  margin: 5,
  block_start_y: 125
}


let font_file_list = fs.readdirSync('./src/fonts/')

font_file_list = font_file_list.filter( f=>f.indexOf('.ttf')!=-1)
// // on node-canvas we need to call this first for each font we want to use
font_file_list.forEach( font=> {
  Canvas.registerFont(`./src/fonts/${font}`, {family: font.replace('.ttf', '')})
  // console.log('registered font', font.replace('.ttf', ''))
})

// ctx.font = '12px "Comic Sans"';
// ctx.fillText(250, 10, 'Everyone hates this font :(');

// let image_file_list = fs.readdirSync('./src/images/')
// console.log(image_file_list)

// https://github.com/Automattic/node-canvas#imagesrcbuffer

// fs.readFile(__dirname + '/images/squid.png', function(err, squid){

// helper for below, promise of image buffer
function get_file(name){
  return new Promise((resolve, reject)=>{
    // console.log(`loading: ${name}`)
    fs.readFile(`./src/images/${name}`, function(err, data){
      // console.log('done with', name)

      let img = new Image;
      img.src =  data //block['image_data']
      // img.src = block['image_data']
      if (err){ reject(err) }
      else resolve(img)
      // img = new Image;
      // img.src = squid;
      // ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);
    })
  })
}

//  helper for below
function draw_caption(ctx, text, x, y, wid){
  // is it too long for one line?
  if (ctx.measureText(text)['width'] > wid) {
    let words = text.split(' ')
    let half = Math.floor(words.length/2)
    let [first, second] = [words.slice(0, half).join(' '), words.slice(half).join(' ')]
    // let [first, second] = [text.substr(0, half), text.substr(half)]
    ctx.fillText(first, x, y)
    ctx.fillText(second, x, y+15) // XXX hardwiring fontsize
  }
  else {
    // single line case, normal
    ctx.fillText(text, x, y)
  }
}


async function build_post_image(data){
  // debug
  // data[0]["image_name"]= "Jared_Kushner_11.jpeg"
  let results = data['data']
  let meta = data['meta']
  // load our small images with await
  let image_buffers = await Promise.all(results.map( m => get_file(m["image_name"]) ))
  results.forEach( (x,i)=> x["image_data"]= image_buffers[i])

  let canvas = new Canvas()
  canvas.width = post_image_dims.width
  canvas.height = post_image_dims.height
  let ctx = canvas.getContext("2d")

  let background_color = randomColor().hexString()
  ctx.fillStyle = background_color
  ctx.fillRect(0, 0, post_image_dims.width, post_image_dims.height)

  // title
  ctx.textAlign = 'center'
  ctx.fillStyle = "black"
  let font = _.sample(font_file_list.filter(x=>x!="Roboto-Regular.ttf")).replace('.ttf', '')
  // console.log(font)
  // debug!
  // meta['title'] ="Come on down to the District of Columbia"
  let font_size = _.contains(["Frijole-Regular","BungeeShade-Regular", "FasterOne-Regular"], font) ? 30 : 36
  font_size = meta["title"] == "Come on down to the District of Columbia" ? font_size : font_size+5
  // console.log(font_size)
  ctx.font = `${font_size}px "${font}"`
  // ctx.font = meta['title'] !="Come on down to the District of Columbia" ?  `45px "${font}"`: `30px "${font}"`
  // ctx.font = '48px "Roboto-Regular"';
  ctx.fillText(meta['title'], post_image_dims.width/2, 75)


  // for images and captions
  results.forEach((block, i)=>{
    // draw it!
    let x = (i%3)*300+post_image_dims.margin+(300-block["image_data"]["width"])/2
    let y = Math.floor(i/3)*250+post_image_dims.block_start_y
    // +(250-block["image_data"]["height"])/2
    ctx.drawImage(block["image_data"], x, y+(175-block["image_data"]["height"])/2, block["image_data"]["width"], block["image_data"]["height"])
    ctx.fillStyle = background_color
    // ctx.fillStyle = "white"
    if (block["image_data"]["height"]>175){
      ctx.fillRect(x-1, y+175, block["image_data"].width+2, block["image_data"].height-175+1  )
    }
    ctx.textAlign = 'center'
    ctx.fillStyle = "black"
    ctx.font = '20px "Roboto-Regular"';
    // ctx.fillText(block['cap'], x+block["image_data"]["width"]/2, y+200)
    draw_caption(ctx, block['cap'], x+block["image_data"]["width"]/2, y+200, block["image_data"]["width"]-10)

    // draw_caption()
  })



  let post_image_buffer = canvas.toBuffer()
  let id = uuidV4()
  fs.writeFileSync(path.join(__dirname, '../output/', `${id}.png`), post_image_buffer )
  // console.log(data)
  // TODO generate the image
  // TODO
  // TODO
  // TODO
  // TODO
}


module.exports = build_post_image



// create node-canvas instance
// var canvas = new Canvas()
//
// ctx = canvas.getContext("2d")
//
// canvas.width  = 500
// canvas.height = 500
// // canvas.attr("width", 500).attr("height", 500)
// ctx.fillStyle = "white"
// ctx.fillRect(0, 0, 500, 500)
// // ctx.strokeStyle = bb.type == 'r' ? "red" : "blue"
// // ctx.strokeWidth = 1
// // x, y, last two are width and height
// // ctx.strokeRect()
// ctx.fillStyle = "blue"
// ctx.fillRect(50, 50, 400, 400)
//
// ctx.fillStyle = "white"
// ctx.fillText("Hello World", 200, 200)
//
// let img = canvas.toBuffer()
// let id = uuidV4()
// fs.writeFileSync(path.join(__dirname, '../output/', `${id}.png`), img )
//
