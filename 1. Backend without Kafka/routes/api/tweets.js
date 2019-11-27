const express = require("express");
const passport = require("passport");

const router = express.Router();
// const passport = require("passport");

// Tweet Model
const Tweet = require("../../models/Tweet");
// User Model

// Validation
const validateTweetInput = require("../../validation/tweet");

// @route GET api/tweets/test
// @desc Test Tweet route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Tweet works"
  })
);

// @route GET api/tweets/get_tweets
// @desc Get Tweets
// @access Public
router.get("/get_tweets", (req, res) => {
  console.log("inside tweet");
  Tweet.find()
    .sort({ tweeted_date: -1 })
    .then(tweets => res.status(200).json(tweets))
    .catch(err => res.status(404).json({ error: `No Tweets found ${err}` }));
});
// @route POST api/tweets/getTweets by username
// @desc Get Tweets
// @access Public
router.post("/getTweets", (req, res) => {
  // console.log("inside getTweet. Username is..", req.body.username);
  let username = req.body.username;
  Tweet.find({ username: username })
    .sort({ tweeted_date: -1 })
    .then(tweets => res.status(200).json(tweets))
    .catch(err => res.status(404).json({ error: `No Tweets found ${err}` }));
});
// @route GET api/tweets/get_tweet/:id
// @desc Get Tweets by id
// @access Public
router.get("/get_tweet/:id", (req, res) => {
  console.log("Inside get tweet route");
  Tweet.findById(req.params.id)
    .then(tweet => {
      console.log("the tweet is" + tweet);
      res.status(200).json(tweet);
    })
    .catch(err =>
      res.status(404).json({ error: `No tweet found with that id ${err}` })
    );
});

// @route POST api/tweets/create_tweet
// @desc Create Tweet
// @access Private
router.post("/create_tweet", (req, res) => {
  const { errors, isValid } = validateTweetInput(req.body);
  // Check Validaiton
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newTweet = new Tweet({
    user: req.body.user_id,
    tweet_content: req.body.tweet_content,
    username: req.body.username,
    avatar: req.body.avatar,
    hashtags: req.body.hashtags
  });
  newTweet.save().then(tweet => res.status(200).json(tweet));
});

/* Needs work (integrate with user model for authorization) (video : post api routes,026, from 7 th min)
//@route DELETE api/tweets/delete_tweet/:id
// @desc Delete Tweet
// @access Private */
router.post("/delete_tweet/:id", (req, res) => {
  Tweet.findByIdAndRemove({ _id: req.params.id })
    .then(res => {
      res.status(200).json({ success: true });
    })
    .catch(err => res.status(404).json({ error: `Tweet not found ${err}` }));
});

router.post("/search_topic", (req, res) => {
  console.log("req for search_topic", req);
  topic = req.body.hashtags;
  Tweet.find({ hashtags: new RegExp(topic, "i") }, (err, result) => {
    if (err) {
      res.status(404).json({ error: `Tweet not found ${err}` });
    } else {
      console.log(result);

      res.status(200).json(result);
    }
  });
});

// @route   Like tweet api/tweets/like/:id
// @desc    Like tweet
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("inside like request");
    User.findOne({ user: req.user.id }).then(user => {
      Tweet.findById(req.params.id)
        .then(tweet => {
          if (
            tweet.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this Tweet" });
          }

          // Add user id to likes array
          tweet.likes.unshift({ user: req.user.id });
          tweet.likes_count += 1;

          tweet.save().then(tweet => res.json(tweet));
        })
        .catch(err =>
          res.status(404).json({ Tweetnotfound: "No Tweet found" })
        );
    });
  }
);

// @route   POST api/tweets/unlike/:id
// @desc    Unlike Tweet
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ user: req.user.id }).then(user => {
      Tweet.findById(req.params.id)
        .then(tweet => {
          if (
            tweet.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this tweet" });
          }

          // Get remove index
          const removeIndex = tweet.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          tweet.likes.splice(removeIndex, 1);
          tweet.likes_count -= 1;

          // Save
          tweet.save().then(tweet => res.json(tweet));
        })
        .catch(err =>
          res.status(404).json({ tweetnotfound: "No tweet found" })
        );
    });
  }
);

module.exports = router;
