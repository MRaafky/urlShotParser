require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { parse } = require('dotenv');
const app = express();
const dns = require('dns')
const urlParser = require("url")

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let databaseUrl = []
let count_shortUrl = 1
app.post("/api/shorturl",(req,res)=>{
  const {url} = req.body
  const ubahUrl = urlParser.parse(url)
  dns.lookup(ubahUrl.hostname, async(err)=>{
    if(err){
      return res.json({
        error : 'Invalid url'
      })
    }
    let validUrl = databaseUrl.find(entry => entry.original_url === url)
    if(validUrl){
      return res.json({
        original_url : validUrl.original_url, short_url : validUrl.short_url
      })
    }
    const urlBaru = {original_url: url , short_url : count_shortUrl++}
    databaseUrl.push(urlBaru)

    res.json(urlBaru)
  })
})
app.get("/api/shorturl/:short_url",function(req,res){
  const shortUrl = parseInt(req.params.short_url)
  const existUrl = databaseUrl.find(entry => entry.short_url === shortUrl)

  if(existUrl){
    return res.redirect(existUrl.original_url)
  }else{
    return res.json({
      error : "No Short URL Found"
    })
  }
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
