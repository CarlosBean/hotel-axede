const express = require('express');
const RoomType = require('../models/roomType');

const app = express();

app.get('/roomType', (req, res) => {
    const from = Number(req.query.from || 0);
    const limit = Number(req.query.limit || 5);

    RoomType.find()
        .skip(from)
        .limit(limit)
        .populate('sede', 'name maxAmountRoom')
        .exec((err, roomTypes) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the roomTypes',
                    err
                })
            }

            RoomType.countDocuments((err, total) => {
                res.json({
                    success: true,
                    message: 'roomTypes obtained successfully',
                    data: roomTypes,
                    total
                });
            });
        })
});

app.get('/roomType/search/:text', (req, res) => {
    const text = req.params.text;
    const regex = new RegExp(text, 'i');

    RoomType.find({ name: regex })
        .populate('sede', 'name maxAmountRoom')
        .exec((err, roomTypes) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the roomTypes',
                    err
                });
            }

            res.json({
                success: true,
                message: 'roomTypes obtained successfully',
                data: roomTypes
            });
        })
});

app.get('/roomType/:id', (req, res) => {
    const id = req.params.id;

    RoomType.findById(id)
        .populate('sede', 'name maxAmountRoom')
        .exec((err, foundRoomType) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the roomType',
                    err
                })
            }

            if (!foundRoomType) {
                return res.status(404).json({
                    success: false,
                    message: `roomType with id ${id} is not exist`,
                    err: { message: `roomType with id ${id} is not exist` }
                })
            }

            res.json({
                success: true,
                message: 'roomType obtained successfully',
                data: foundRoomType,
            });
        })
});

app.post('/roomType', (req, res) => {
    const body = req.body;
    const roomType = new RoomType({
        name: body.name,
        price: body.price,
        amount: body.amount,
        sede: body.sede
    });

    roomType.save((err, savedRoomType) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'an error ocurred while attempting to create the roomType',
                err
            })
        }

        res.status(201).json({
            success: true,
            message: 'roomType was created successfully',
            data: savedRoomType
        })
    });
});

app.put('/roomType/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    RoomType.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, foundRoomType) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the roomType',
                err
            })
        }

        res.status(200).json({
            success: true,
            message: 'roomType was updated successfully',
            data: foundRoomType
        })
    });
});

app.delete('/roomType/:id', (req, res) => {
    const id = req.params.id;

    RoomType.findByIdAndUpdate(id, (err, deletedRoomType) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the roomType',
                err
            });
        }

        if (!deletedRoomType) {
            return res.status(400).json({
                success: false,
                message: `roomType with id ${id} is not exist`,
                err: { message: `roomType with id ${id} is not exist` }
            });
        }

        res.status(200).json({
            success: true,
            message: 'roomType was deleted successfully',
            data: deletedRoomType
        });
    });
});

module.exports = app;