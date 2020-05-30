const sharp = require('sharp');
const express = require('express');
const fs = require('fs');
const file_name = f => f.replace(/(.*\/)*([^.]+).*/ig, "$2");

const PORT = 8080;

const app = express();
app.use(express.static('./files/output'));
app.use(express.json());

app.put('/original_image', (req, res) => {
    const image = sharp(`files/input/${req.body.original_image_file_name}`, { limitInputPixels: 0 });
    image.metadata().
        then(function (metadata) {
            res.status(200).send(metadata);
            image
                .png()
                .tile({
                    layout: 'google',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .toFile(`files/output/${file_name(req.body.original_image_file_name)}`, function (err, info) {
                    fs.writeFile(`files/output/${file_name(req.body.original_image_file_name)}/info.json`, JSON.stringify(info), function (err) {
                        if (err) {
                            console.error(err);
                        }
                        console.log(info);
                    });
                });
        }).catch(function (err) {
            console.error(err);
            res.status(400).send(err.message);
        });
});

app.listen(PORT);
console.log(`tile server start`);