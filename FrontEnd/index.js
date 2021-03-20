const express = require("express")
const path = require("path")
const multer = require("multer")
const app = express()
const request = require('request');
const fs = require('fs');


app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads")
	},
	filename: function (req, file, cb) {
	cb(null, file.fieldname + "-" + Date.now()+".pdf")
	}
})


const maxSize = 1 * 1000 * 1000;

var upload = multer({
	storage: storage,
	limits: { fileSize: maxSize },
	fileFilter: function (req, file, cb){


		var filetypes = /pdf/;
		var mimetype = filetypes.test(file.mimetype);

		var extname = filetypes.test(path.extname(
					file.originalname).toLowerCase());

		if (mimetype && extname) {
			return cb(null, true);
		}

		cb("Error: File upload only supports the "
				+ "following filetypes - " + filetypes);
	}


}).single("mypdf");

app.get("/",function(req,res){
	res.render("index");
})

app.post("/uploadPdf",function (req, res, next) {


	upload(req,res,function(err) {

		if(err) {

			res.send(err)
		}
		else {


			res.send("Success, pdf uploaded!")
		}
	})
})

var url = 'https://pdftables.com/api?key=8ag1p23i9bjx&format=csv';
var req = request.post({encoding: null, url: url}, function (err, resp, body) {
 if (!err && resp.statusCode == 200) {
   fs.writeFile("output.csv", body, function(err) {
     if (err) {
       console.log('error writing file');
     }
   });
 } else {
   console.log('error retrieving URL');
 };
});

var form = req.form();
form.append('file', fs.createReadStream('uploads/test.pdf'));
app.listen(3000,function(error) {
	if(error) throw error
		console.log("Server created Successfully on PORT 3000")
})
