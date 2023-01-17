const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require('mongoose');

//--------MONGO --------------------------------------------------------
mongoose.connect("mongodb+srv://inga:inga@cluster0.lmpix.mongodb.net/blogDB?retryWrites=true&w=majority", {useNewUrlParser: true}, () => console.log('connected to mongo db'));

const postSchema = new mongoose.Schema({
  title: String,
  text: String
})
//collection Posts to keep all the posts from blog
const Post = mongoose.model('Post', postSchema);
//----------------------------------------------------------------------





const homeStartingContent = "Dear diary, I have so much to tell you... So much has happened since the last time I just sat down and started writing down what I feel. There are so many stories I haven't really shared with you. But why? Why haven't I written anything personal on my blog? Today is the day to start...";
const aboutContent = " I am a very creative person, and I felt the need for having a creative outlet for all my thoughts and ideas. That is why I initially started blogging. My blog is an online brand for anything beauty, life, style, home, and mind-related. I love to share fashion trends and my personal style, and my favorite beauty products and new releases. I enjoy discussing more lifestyle-oriented topics as well, such as travel, interior, and food.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
let posts = []; //list of posts that user entered

app.set('view engine', 'ejs');
//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));





//ROUTES:
app.get("/", function(req, res){

  Post.find(function(err, posts){
    res.render("home", {
        homeContent: homeStartingContent,
        posts: posts
    });
  })
  

})
 

app.get("/about", function(req, res){
  res.render("about", { aboutContent: aboutContent});
})

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
})


app.get("/compose", function(req, res){
  res.render("compose");

})



//adding posts to DB
app.post("/compose", function(req, res){  //when user pushes "publish" btn
  let composeTitle = req.body.composeTitle;
  let composeText = req.body.composeText;

  let post = new Post({
    title: composeTitle,
    text: composeText
  })

  post.save(function(err){
    if(!err)   res.redirect("/"); //redirecting to the home page that will have a new post entered displayed
  });


})



//showing a post in separate page
app.get("/posts/:postId", function(req, res){
    let postId = req.params.postId;
    //console.log(postId);

    Post.findOne({_id: postId}, function(err, postObj){
      res.render('post', {
        postTitle: postObj.title,
        postText: postObj.text
      })
    })
})






app.listen(process.env.PORT || 3000,  function() {
  console.log("Server started");
});
