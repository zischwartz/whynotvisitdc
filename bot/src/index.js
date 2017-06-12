// let fs = require('fs')
// let sentiment = require('sentiment')
let build_image = require("./build_image.js")
let generator = require("./generator.js")
// let post = require("./post.js")

let data = generator()
build_image(data)
// console.log(data)
