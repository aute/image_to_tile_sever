const sharp = require('sharp');
const express = require('express');
const file_name = f => f.replace(/(.*\/)*([^.]+).*/ig, "$2");

const PORT = 8080;

const app = express();
app.use(express.static('./files/output'));
app.use(express.json());

app.put('/original_image', (req, res) => {
    const image = sharp(`files/input/${req.body.original_image_file_name}`, { limitInputPixels: false });
    image.metadata().
        then(function (metadata) {
            image
                .png()
                .tile({
                    layout: 'google',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .toFile(`files/output/${file_name(req.body.original_image_file_name)}`, function (err, info) {
                    console.info(info);
                    res.status(200).send(info);
                });
        }).catch(function (err) {
            console.error(err);
            res.status(400).send(err.message);
        });
});

app.listen(PORT);
console.log(`tile server start`);