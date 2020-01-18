// Dependencies
var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");

router.get("/", function(req, res) {
    res.redirect("/articles");
});

// GET route for scraping
router.get("/scrape", function (req, res) {
  axios.get("https://www.makezine.com/blog/").then(function (response) {
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands
      var $ = cheerio.load(response.data);
      
      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $(".about-post").each(function (i, element) {
        var title = $(element).children().find("a").text();
        var link = $(element).children().find("a").attr("href");
        var img = $(element).siblings().find("img").attr("src");
  
        var results = {
          title: title,
          link: link,
          img: img
        };
  
        // save will save all objects
        db.Article.save(results);
  
        // Log the results once you've looped through each of the elements found with cheerio
      console.log(results);
      }); // end of $(".about-post").each...

      // Send a message to the client
      res.send("Scrape Complete");
    });
});

router.get("articles-json", function(req, res) {
    Article.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    }); 
});

router.get("/clear"), function(req, res) {
    Article.remove({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("All articles removed");
        }
    });
    res.redirect("/articles-json");
}

module.exports = router;