const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    mq2: { type: Number, required: false },
    temperature: { type: Number, required: false },
    humidity: { type: Number, required: false },
    pir: { type: Boolean, required: false },
    ir: { type: Boolean, required: false },
    timestamp: { 
        type: Date, 
        default: Date.now, 
        expires: 60 * 60 * 24 * 2 // 2 days in seconds
    },
});

module.exports = mongoose.model('SensorData', sensorDataSchema);
