const express = require('express');
const Sede = require('../models/sede');

const app = express();

app.get('/sede', (req, res) => {
    const from = Number(req.query.from || 0);
    const limit = Number(req.query.limit || 5);

    Sede.find({ available: true })
        .skip(from)
        .limit(limit)
        .exec((err, sedes) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the sedes',
                    err
                })
            }

            Sede.countDocuments({ available: true }, (err, total) => {
                res.json({
                    success: true,
                    message: 'sedes obtained successfully',
                    data: sedes,
                    total
                });
            });
        })
});

app.get('/sede/search/:text', (req, res) => {
    const text = req.params.text;
    const regex = new RegExp(text, 'i');

    Sede.find({ name: regex })
        .exec((err, sedes) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the sedes',
                    err
                });
            }

            res.json({
                success: true,
                message: 'sedes obtained successfully',
                data: sedes
            });
        })
});

app.get('/sede/:id', (req, res) => {
    const id = req.params.id;

    Sede.findById(id)
        .exec((err, foundSede) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the sede',
                    err
                })
            }

            if (!foundSede) {
                return res.status(404).json({
                    success: false,
                    message: `sede with id ${id} is not exist`,
                    err: { message: `sede with id ${id} is not exist` }
                })
            }

            res.json({
                success: true,
                message: 'sede obtained successfully',
                data: foundSede,
            });
        })
});

app.post('/sede', (req, res) => {
    const body = req.body;
    const sede = new Sede({
        name: body.name,
        maxAmountRoom: body.maxAmountRoom,
    });

    sede.save((err, savedSede) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'an error ocurred while attempting to create the sede',
                err
            })
        }

        res.status(201).json({
            success: true,
            message: 'sede was created successfully',
            data: savedSede
        })
    });
});

app.put('/sede/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Sede.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, foundSede) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the sede',
                err
            })
        }

        res.status(200).json({
            success: true,
            message: 'sede was updated successfully',
            data: foundSede
        })
    });
});

app.delete('/sede/:id', (req, res) => {
    const id = req.params.id;

    Sede.findByIdAndUpdate(id, { available: false }, (err, deletedSede) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the sede',
                err
            });
        }

        if (!deletedSede) {
            return res.status(400).json({
                success: false,
                message: `sede with id ${id} is not exist`,
                err: { message: `sede with id ${id} is not exist` }
            });
        }

        res.status(200).json({
            success: true,
            message: 'sede was deleted successfully',
            data: deletedSede
        });
    });
});

module.exports = app;