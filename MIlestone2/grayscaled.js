const fs = require("fs"),
    PNG = require('pngjs').PNG,
    path = require('path');

const grayScale = (pathIn, pathOut) => {
    return new Promise((res) => {
        fs.createReadStream(pathIn)
                    .pipe(
                    new PNG({
                        colorType: 0,
                    })
                )
                .on("parsed", function ()  {
                    this.pack().pipe(fs.createWriteStream(pathOut+"/" + path.basename(pathIn)));
                    res();
                });
    });
}
module.exports = { grayScale };
