//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://admin-jae:wnstjd77@cluster0-sgqde.mongodb.net/blogPostDB', {useNewUrlParser: true, useUnifiedTopology: true})


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Mongoose
const blogsSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: [true, "Needs Title"]
  },
  content: {
    type: String,
    required: [true, "Needs Content"]
  }
})

const Blog = mongoose.model("Blog", blogsSchema)

const Day1 = new Blog({
  title: "Day 1",
  content: "Today is a good day to be alive."
})



//App Logic
const app = express();


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get('/', function(req,res) {

  Blog.find({}, function(err, foundItems){
    res.render('home', {homeStartingContent: homeStartingContent, posts: foundItems})
  })

})

app.get('/about', function(req,res) {
  res.render('about', {aboutContent: aboutContent} )
})

app.get('/contact', function(req,res) {
  res.render('contact', {contactContent: contactContent} )
})

app.get('/compose', function(req,res) {
  res.render('compose')
})


app.post('/compose', function(req,res) {

  let finalTitle = req.body.newTitle
  let finalContent = req.body.newPost

  Blog.findOne({title: finalTitle}, function(err, foundList) {

    if(!err){
      if(!foundList){
        const blog = new Blog ({
          title: finalTitle,
          content: finalContent
        })
        blog.save()
      }
    }
    res.redirect("/")
  })
})


//Navigates to the post already created.
app.get('/posts/:topic', function(req,res) {

  let requestedTitle = _.lowerCase(req.params.topic)


  Blog.find({}, function(err, foundItems){

    foundItems.forEach(function(post) {

      const storedTitleLowerCase = _.lowerCase(post.title)
      const storedTitle = post.title
      const storedContent = post.content
  
      if (requestedTitle === storedTitleLowerCase) {
        res.render('post', {storedTitle: storedTitle, storedContent: storedContent})
      } else {
      }
    })
  })
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Your server is successfully running");
});
