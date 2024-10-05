require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const url = require('url')
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;
const jsonParser = bodyParser.urlencoded({extended: false});
const submittedUrls = new Array({original_url: "https://google.com", short_url: 40});

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', jsonParser, function (req, res)
{
  if (req.body.url != undefined)
  {
    try
    {
      new URL(req.body.url);
      submittedUrls.push({original_url: req.body.url, short_url: submittedUrls.length + 1})
      res.json({original_url: req.body.url, short_url: submittedUrls.length});
    }
    catch
    {
      res.json({error:"Invalid URL"});
    }
  }
  else
  {
    res.json({error:"Invalid URL"});
  }
})

app.get("/api/shorturl/:short_url", jsonParser, function (req, res)
{
  for (let i = 0; i < submittedUrls.length; i++)
  {
    if (submittedUrls[i].short_url == req.params.short_url)
    {
      res.redirect(submittedUrls[i].original_url);
    }
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
