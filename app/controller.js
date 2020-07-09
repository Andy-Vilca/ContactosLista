// ./app/controller.js
var cloudinary = require('cloudinary');
var Model = require('./model');

cloudinary.config({
    cloud_name: 'da8o0bpgg',
    api_key: '882724672419278',
    api_secret: 'WwMg-iKfC14QfMgqCi9I5LCKAbA'
});

module.exports = {
    login: function(req,res){
        res.render('pages/index');
    },
    index: function (req, res) {
        Model.find({}, function (err, contactos) {
            if (err) res.send(err);

            res.render('pages/lista', { contactos: contactos });
        });
    },
    find: function (req, res) {
        var id = req.params.id;
        Model.findOne({ image_id: id }, function (err, contacto) {
            if (err) res.send(err);

            res.render('pages/single', { contacto: contacto, image: cloudinary.image, image_url: cloudinary.url });
        })
    },
    new: function (req, res) {
        res.render('pages/new');
    },
    edit: function (req, res) {
        Model.find({ image_id: req.params.id }, function (err, contactos) {
            if (err) res.send(err);

            res.render('pages/edit', { contacto: contactos[0] });
        });
    },
    create: function (req, res) {
        cloudinary.v2.uploader.upload(req.files.image.path,
            { width: 300, height: 300, crop: "limit", moderation: 'manual' },
            function (err, result) {
                console.log(result);
                var contacto = new Model({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    email: req.body.email,
                    fecha: req.body.fecha,
                    created_at: new Date(),
                    image: result.url,
                    image_id: result.public_id
                });

                contacto.save(function (err) {
                    if (err) {
                        res.send(err)
                    }
                    res.redirect('/lista');
                });
            });
    },
    update: function (req, res) {
        var oldName = req.body.old_id
        var newName = req.body.image_id;
        cloudinary.v2.uploader.rename(oldName, newName,
            function (error, result) {
                if (error) res.send(error);
                Model.findOneAndUpdate({ image_id: oldName },
                    Object.assign({}, req.body, { image: result.url }),
                    function (err) {
                        if (err) res.send(err);

                        res.redirect('/lista');
                    })
            })

    },
    destroy: function (req, res) {
        var imageId = req.body.image_id;
        cloudinary.v2.uploader.destroy(imageId, function (error, result) {
            Model.findOneAndRemove({ image_id: imageId }, function (err) {
                if (err) res.send(err);

                res.redirect('/lista');
            });
        });
    },

    filtrar: {
        index: function (req, res) {
            var q = req.query.q;
            var callback = function (result, contacto) {
                var searchValue = '';
                if (q) {
                    searchValue = q;
                }
                res.render('filtrar/index', { contacto: contacto, contactos: result.resources, searchValue: searchValue });
            };
            if (q) {
                cloudinary.api.resources(callback,
                    { type: 'upload', prefix: q });
            } else {
                cloudinary.api.resources(callback);
            }
        }
    }
};
