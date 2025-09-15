const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    mq2: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    pir: { type: Boolean, required: true },
    ir: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SensorData', sensorDataSchema);