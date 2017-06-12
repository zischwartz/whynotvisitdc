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
    console.log(`loading: ${name}`)
    fs.readFile(`./src/images/${name}`, function(err, data){
      console.log('done with', name)

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


async function build_post_image(data){
  // debug
  // data[0]["image_name"]= "Jared_Kushner_11.jpeg"

  // load our small images
  // let image_buffers = await  Promise.all(data.map( m => get_file(m["image_name"]) ))
  let image_buffers = await Promise.all(data.map( m => get_file(m["image_name"]) ))
  // console.log('z')
  // console.log(image_buffers)
  data.forEach( (x,i)=> x["image_data"]= image_buffers[i])

  let canvas = new Canvas()
  canvas.width = post_image_dims.width
  canvas.height = post_image_dims.height
  let ctx = canvas.getContext("2d")
  //
  let background_color = randomColor().hexString()
  ctx.fillStyle = background_color
  ctx.fillRect(0, 0, post_image_dims.width, post_image_dims.height)

  // title
  ctx.textAlign = 'center'
  ctx.fillStyle = "black"
  let font = _.sample(font_file_list).replace('.ttf', '')
  console.log(font)
  ctx.font = `55px "${font}"`;
  // ctx.font = '48px "Roboto-Regular"';
  ctx.fillText("Why Not Visit DC?", post_image_dims.width/2, 75)


  // for images and captions
  data.forEach((block, i)=>{
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
    ctx.fillText(block['caption'], x+block["image_data"]["width"]/2, y+200)

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
