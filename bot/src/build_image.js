let fs = require('fs')
let path = require('path')
let stream = require('stream')
let Canvas = require('canvas')
let _ =  require('underscore')
let uuidV4 = require('uuid/v4')

Image = Canvas.Image

// WIP
// WIP
// WIP
// WIP
// WIP

// and add to dockerfile
// -v $(pwd)/toy/fonts:/toy/fonts
// TODO
let font_file_list = fs.readdirSync('./fonts/')
font_file_list = font_file_list.filter( f=>f.indexOf('.ttf')!=-1)
// on node-canvas we need to call this first for each font we want to use
font_file_list.forEach( font=> {
  Canvas.registerFont(`./fonts/${font}`, {family: font.replace('.ttf', '')})
  // console.log('registered font', font.replace('.ttf', ''))
})

// https://github.com/Automattic/node-canvas#imagesrcbuffer

fs.readFile(__dirname + '/images/squid.png', function(err, squid){
  if (err) throw err;
  img = new Image;
  img.src = squid;
  ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);
});


// create node-canvas instance
var canvas = new Canvas()

ctx = canvas.getContext("2d")

canvas.width  = 500
canvas.height = 500
// canvas.attr("width", 500).attr("height", 500)
ctx.fillStyle = "white"
ctx.fillRect(0, 0, 500, 500)
// ctx.strokeStyle = bb.type == 'r' ? "red" : "blue"
// ctx.strokeWidth = 1
// x, y, last two are width and height
// ctx.strokeRect()
ctx.fillStyle = "blue"
ctx.fillRect(50, 50, 400, 400)

ctx.fillStyle = "white"
ctx.fillText("Hello World", 200, 200)

let img = canvas.toBuffer()
let id = uuidV4()
fs.writeFileSync(path.join(__dirname, '../output/', `${id}.png`), img )


// all_opts.forEach( (opt, i)=> {
//   let id = uuidV4()
//   // actually draw the damn thing and get the boundaries we ended up drawing
//   let boundaries = doc_gen.create(canvas, opt, table_data)
//   // now get the image data
//   let img = canvas.toBuffer()
//   // and write out the files
//   fs.writeFileSync(path.join(__dirname, '../output/', `${id}.png`), img )
//   fs.writeFileSync(path.join(__dirname, '../output/', `${id}.json`), JSON.stringify(boundaries), 'utf8' )
//   fs.writeFileSync(path.join(__dirname, '../output/', `opt-${id}.json`), JSON.stringify(opt), 'utf8' )
// })
// doc_gen.create(canvas, opt, table_data)
// canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, '../output/', 'text.png')))
