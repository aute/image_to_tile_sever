const sharp = require('sharp');
const express = require('express');
const fs = require('fs');

const PORT = 8080;
const tile_opt = {
    layout: 'google',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
};
const get_file_name = f => f.replace(/(.*\/)*([^.]+).*/ig, "$2");

const putCallback = (req, res) => {
    const original_name = req.body.original_image_file_name;
    const file_name = get_file_name(original_name);
    const image = sharp(`files/input/${original_name}`, { limitInputPixels: 0 });
    const writeFile = (err, info) => {
        fs.writeFile(
            `files/output/${file_name}/info${info ? 'info' : 'error'}.json`,
            JSON.stringify(info || err),
            error => console.log(`output ${file_name}:${JSON.stringify(error || err || info)}`)
        );
    };
    image.metadata().
        then((metadata) => {
            res.status(200).send(metadata);
            console.log(`input ${file_name}:${JSON.stringify(metadata)}`);
            image
                .png()
                .ensureAlpha()
                .tile(tile_opt)
                .toFile(`files/output/${file_name}`, writeFile);
        }).catch((err) => {
            console.error(err);
            res.status(400).send(err.message);
        });
};

const app = express();
app.use(express.json(), express.static('./files/output'));
app.put('/original_image', putCallback);
app.listen(PORT);
console.log(`tile server start`);