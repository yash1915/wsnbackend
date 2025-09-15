const http = require('http');

const sendData = () => {
    const data = {
        mq2: Math.floor(Math.random() * 1000),
        temperature: (Math.random() * 20 + 20).toFixed(2),
        humidity: (Math.random() * 40 + 50).toFixed(2),
        pir: Math.random() > 0.8,
        ir: Math.random() > 0.9,
    };

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/sensors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(JSON.stringify(data));
    req.end();
};

setInterval(sendData, 5000); // Send data every 5 seconds