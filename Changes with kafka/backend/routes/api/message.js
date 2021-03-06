const express = require("express");

const router = express.Router();

const Message = require("../../models/Message");

router.post("/send_message", (req, res) => {
  const { sender_name, receiver_name, message } = req.body;
  console.log("inside send_message api of backend.");
  User.findOne({ username: sender_name })
    .then(user => {
      if (!user) {
        console.log("no user");
        return res.status(404).json({ msg: "no sender with this id" });
      }
      // console.log("sender user details:", user);
      User.findOne({ username: receiver_name }).then(user1 => {
        if (!user1) {
          console.log("no receiver found");
          return res.status(404).json({ msg: "no receiver with this id" });
        }
        // console.log("receiver user details:", user1);
        const newMessage = new Message({
          sender_name: sender_name,
          receiver_name: receiver_name,
          message: message
        });
        newMessage.save().then(messages => res.status(200).json(messages));
      });
    })
    .catch(err => {
      console.log("err is.....", err);
      res.status(404).json(err);
    });
});

router.post("/get_messages", (req, res) => {
  const { sender_name, receiver_name } = req.body;
  console.log("inside get_messages api of backend");
  Message.find({ sender_name, receiver_name })
    .then(message => {
      if (!message) {
        console.log("no message");
        return res
          .status(404)
          .json({ msg: "no sent messages from this sender" });
      }
      // console.log("message is....", message);
      const all_msgs = [];
      all_msgs.push(message);
      Message.find({
        sender_name: receiver_name,
        receiver_name: sender_name
      }).then(msg1 => {
        if (!msg1) {
          console.log("no message");
          return res
            .status(404)
            .json({ msg: "no received messages for this sender" });
        }
        // console.log("received messages are: ", msg1);
        all_msgs.push(msg1);
        res.json(all_msgs);
      });
    })
    .catch(err => {
      console.log("err is.....", err);
      res.status(404).json(err);
    });
});

module.exports = router;
