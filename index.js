require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({ extended: true }));

// Define in-memory storage for original URLs and their corresponding short URLs
const urlMap = new Map();
let shortUrlCounter = 1;

// Define API endpoints
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  
  // Validate URL format
  const urlPattern = /^(https?):\/\/(\w+\.)+\w{2,}(\/\S*)?$/;
  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Generate short URL
  const shortUrl = shortUrlCounter++;
  
  // Store original URL and short URL mapping
  urlMap.set(shortUrl.toString(), originalUrl);

  // Return response with original URL and short URL
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  
  // Redirect to original URL if short URL exists in mapping
  if (urlMap.has(shortUrl)) {
    const originalUrl = urlMap.get(shortUrl);
    res.redirect(originalUrl);
  } else {
    res.status(404).send('Short URL not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
