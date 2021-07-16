const express = require('express');
const Reservation = require('../models/reservation');

const app = express();

app.get('/reservation', (req, res) => {
    const from = Number(req.query.from || 0);
    const limit = Number(req.query.limit || 5);

    Reservation.find()
        .skip(from)
        .limit(limit)
        .populate('roomType', 'name price')
        .exec((err, reservations) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the reservations',
                    err
                })
            }

            Reservation.countDocuments((err, total) => {
                res.json({
                    success: true,
                    message: 'reservations obtained successfully',
                    data: reservations,
                    total
                });
            });
        })
});

app.get('/reservation/search/:text', (req, res) => {
    const text = req.params.text;
    const regex = new RegExp(text, 'i');

    Reservation.find({ name: regex })
        .populate('roomType', 'name price')
        .exec((err, reservations) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the reservations',
                    err
                });
            }

            res.json({
                success: true,
                message: 'reservations obtained successfully',
                data: reservations
            });
        })
});

app.get('/reservation/:id', (req, res) => {
    const id = req.params.id;

    Reservation.findById(id)
        .populate('roomType', 'name price')
        .exec((err, foundReservation) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'an error ocurred while attempting to find the reservation',
                    err
                })
            }

            if (!foundReservation) {
                return res.status(404).json({
                    success: false,
                    message: `reservation with id ${id} is not exist`,
                    err: { message: `reservation with id ${id} is not exist` }
                })
            }

            res.json({
                success: true,
                message: 'reservation obtained successfully',
                data: foundReservation,
            });
        })
});

app.post('/reservation', (req, res) => {
    const body = req.body;
    const reservation = new Reservation({
        name: body.name,
        price: body.price,
        amount: body.amount,
        sede: body.sede
    });

    reservation.save((err, savedReservation) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'an error ocurred while attempting to create the reservation',
                err
            })
        }

        res.status(201).json({
            success: true,
            message: 'reservation was created successfully',
            data: savedReservation
        })
    });
});

app.put('/reservation/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Reservation.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, foundReservation) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the reservation',
                err
            })
        }

        res.status(200).json({
            success: true,
            message: 'reservation was updated successfully',
            data: foundReservation
        })
    });
});

app.delete('/reservation/:id', (req, res) => {
    const id = req.params.id;

    Reservation.findByIdAndUpdate(id, (err, deletedReservation) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'an error ocurred while attempting to update the reservation',
                err
            });
        }

        if (!deletedReservation) {
            return res.status(400).json({
                success: false,
                message: `reservation with id ${id} is not exist`,
                err: { message: `reservation with id ${id} is not exist` }
            });
        }

        res.status(200).json({
            success: true,
            message: 'reservation was deleted successfully',
            data: deletedReservation
        });
    });
});

module.exports = app;