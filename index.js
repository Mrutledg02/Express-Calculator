const express = require('express');
const app = express();
const ExpressError = require('./expressError');

// Helper function to parse and validate the request body
function parseNumbers(nums) {
    if (!nums) throw new ExpressError("nums are required.", 400);
    let numArray = nums.split(',').map(n => {
        let num = parseInt(n);
        if (isNaN(num)) throw new ExpressError(`${n} is not a number.`, 400);        
        return num;
    });
    return numArray;
}

// Mean route
app.get('/mean', (req, res) => {
    try {
        let nums = parseNumbers(req.query.nums);
        let mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        return res.json({ operation: 'mean', value: mean });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Median route
app.get('/median', (req, res) => {
    try {
        let nums = parseNumbers(req.query.nums);
        nums.sort((a, b) => a - b);
        let median;
        if (nums.length % 2 === 0) {
            let mid = Math.floor(nums.length / 2);
            median = (nums[mid - 1] + nums[mid]) / 2;
        } else {
            let mid = Math.floor(nums.length / 2);
            median = nums[mid];
        }
        return res.json({ operation: 'median', value: median });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Mode route
app.get('/mode', (req, res) => {
    try {
        let nums = parseNumbers(req.query.nums);
        let counts = {};
        nums.forEach(num => counts[num] = (counts[num] || 0) + 1);
        let mode = nums.sort((a, b) => counts[b] - counts[a])[0];
        res.json({ operation: 'mode', value: mode });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// If no other route matches, respond with a 404
app.use((req, res, next) => {
    const error = new ExpressError("Page Not Found", 404);
    next(error);
});

// Error handler
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message;

    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app;

app.listen(3000, () => {
    console.log('Server started on port 3000');
});