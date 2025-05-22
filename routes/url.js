const express = require('express');
const router = express.Router();
const Url = require('../models/url');
const shortid = require('shortid');

const BASE_URL = "http://localhost:5000"; // Change to your domain in production

// POST /shorten - create short URL
router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortId = shortid.generate();

    const newUrl = new Url({
        longUrl,
        shortId
    });

    await newUrl.save();

    res.json({ shortUrl: `${BASE_URL}/${shortId}` });
});

// GET /:shortId - redirect to long URL
router.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;

    const urlData = await Url.findOne({ shortId });

    if (urlData) {
        return res.redirect(urlData.longUrl);
    } else {
        return res.status(404).json({ error: 'Short URL not found' });
    }
});

module.exports = router;
