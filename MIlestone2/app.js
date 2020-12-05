
const http = require('http');
url = require('url');
fs = require('fs');
path = require('path');
formidable = require('formidable')
grayscale = require("./grayscaled.js").grayScale
port = 3000;
host = "DESKTOP-VQCL3PF";

let dir = path.join(__dirname, 'public');

let mime = {
html: 'text/html',
txt: 'text/plain',
css: 'text/css',
gif: 'image/gif',
jpg: 'image/jpeg',
png: 'image/png',
svg: 'image/svg+xml',
js: 'application/avascript'
};

let server = http.createServer(function (req, res) {
let reqpath = req.url.toString().split('?')[0];
if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
console.log('entered formidable section')
res.writeHead(200, {'Content-Type': 'text/html'});
let form = new formidable.IncomingForm();
form.uploadDir = "./public/uploads"
form.keepExtensions = true;
form.maxFieldsSize = 10 * 1024 * 1024;
form.multiples = true;
form.parse(req, (err, fields, files) => {
    if(err) {
        res.json({
            result: "failed",
            data: {},
            message: `cannot upload images. Error is : ${err}`
        });
    }
let formData = ({fields: fields, files: files})
let link = (formData.files.multipleFiles.path)
let pngImg = link.slice(14)
grayscale(path.join(__dirname, link), path.join(__dirname, 'public', 'grayscaled'))
    .catch((err) => console.log(err))
    .then(() => {
    console.log('successful grayscale')
    
       
   })
})
}

let file = path.join(dir, reqpath.replace(/\/$/, '/index.html'));
console.log(file)
if (req.method === 'GET') {
if (file.indexOf(dir + path.sep) !== 0) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('Forbidden');
}
let type = mime[path.extname(file).slice(1)] || 'text/plain';
let s = fs.createReadStream(file);
s.on('open', function () {
    res.statusCode = 200;
    res.setHeader('Content-Type', type);
    s.pipe(res);
});
s.on('error', function () {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 404;
    res.end('Not found');
});
}
});

server.listen(port, function () {
console.log(`Listening on http://localhost:${port}/`);
});