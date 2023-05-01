const http = require('http');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const url = require('url');
const sql = require('./db/sql_utils')

const photo_filenames = []
index = 0

var priordate = ""

const ROOT = "C:\\Users\\Will Pike\\Programming\\Photo Date Inputter\\"

// Load file names
for (var discNum in [1, 2, 3, 4]) {
	let folderName = ROOT + "\\photos\\ScanMyPhotos\\Disc " + discNum;

	fs.readdir(folderName, async (err, files) => {
		sql.get_filenames_with_adequate_data(function (rows) {
			for (var i in files) {
				relativeFilename = "\\photos\\ScanMyPhotos\\Disc " + discNum + "\\" + files[i]
				if (!rows.includes(relativeFilename)) {
					photo_filenames.push(relativeFilename)
					// console.log("Added " + relativeFilename + " to filenames")
				}
			}
		});
	});
}


function serve_index(req, res) {
	fs.readFile('public/index.html', function (err, data) {
		if (err) throw err

		res.writeHead(200, {'Content-Type': 'text/html'});

		const $ = cheerio.load(data)
		var next_image_filename = get_next_filename()

		$("#photo").attr("src", next_image_filename)
		$("#filename").attr("value", next_image_filename)

		if (priordate !== "") $("# date").val(priordate)

		res.write($.root().html());
		res.end();
	});
}


function serve_css(req, res) {
	fs.readFile(path.join(__dirname, "public", req.url), function (err, data) {
		if (err) throw err
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.end(data)
	});
}

function server_js(req, res) {
	// console.log("Loading " + req.url)
	fs.readFile(path.join(__dirname, "public", req.url), function (err, data) {
		if (err) throw err
		res.writeHead(200, {'Content-Type': 'text/javascript'});
		res.end(data)
	});
}

function serve_image(req, res) {
	const imagePath = path.join(__dirname, decodeURIComponent(req.url));

	fs.readFile(imagePath, function (error, content) {
		if (error) throw error
		res.writeHead(200, {'Content-Type': 'image/jpeg'});
		res.end(content, 'utf-8');
	});
}


function submit_query(req, res) {
	query = url.parse(req.url, true).query
	priordate = query.date
	sql.log_to_sql(query)
	res.writeHead(302, {'Location': '/'});
	res.end()
}

http.createServer(function (req, res) {
	// console.log(req.url)
	if (req.url === "/") {
		serve_index(req, res);
	} else if (req.url.match("\.css$")) {
		serve_css(req, res)
	}else if (req.url.match("\.js$")){
		server_js(req, res)
	} else if (req.url.match("\.jpg$")) {
		serve_image(req, res)
	} else if (url.parse(req.url).pathname === "/submit") {
		submit_query(req, res)
	} else {
		res.writeHead(404)
		res.write("<h1>404: File not found</h1>")
		res.end()
	}

}).listen(8001);


function get_next_filename() {
	const item = photo_filenames[index];
	// console.log(item)
	index++;
	return item
}

