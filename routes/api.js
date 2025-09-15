const express = require('express');
const SensorData = require('../models/sensorData');
const sendAlert = require('../utils/alertMailer');

module.exports = (broadcast) => {
    const router = express.Router();

    // GET latest sensor data
    router.get('/sensors', async (req, res) => {
        try {
            const data = await SensorData.findOne().sort({ timestamp: -1 });
            res.json(data);
        } catch (err) {
                console.log("here is the error");
            res.status(500).json({ message: err.message });
        }
    });

    // GET sensor data for the last hour
    router.get('/sensors/history', async (req, res) => {
        try {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const data = await SensorData.find({ timestamp: { $gte: oneHourAgo } }).sort({ timestamp: 1 });
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // GET all alerts
    router.get('/sensors/alerts', async (req, res) => {
        try {
            const alerts = await SensorData.find({
                $or: [
                    { mq2: { $gt: 500 } },
                    { temperature: { $gt: 35 } },
                    { pir: true },
                    { ir: true }
                ]
            }).sort({ timestamp: -1 });
            res.json(alerts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });


router.post('/sensors', async (req, res) => {
    const { mq2, temperature, humidity, pir, ir } = req.body;

    try {
        console.log("Data received successfully:", req.body);

        const newData = new SensorData({ mq2, temperature, humidity, pir, ir });
        const savedData = await newData.save();
        broadcast(savedData);

        // Alerts
        if (mq2 !== undefined && mq2 > 500) {
            sendAlert('High Gas Level Detected!', `MQ2 value: ${mq2}`);
        }
        if (temperature !== undefined && temperature > 35) {
            sendAlert('High Temperature Detected!', `Temperature: ${temperature}°C`);
        }
        if (pir) {
            sendAlert('Motion Detected!', 'PIR sensor triggered');
        }
        if (ir) {
            sendAlert('Object Detected!', 'IR sensor triggered');
        }

        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

return router;
