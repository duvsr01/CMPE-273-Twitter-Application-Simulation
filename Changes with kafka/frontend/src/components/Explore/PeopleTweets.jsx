import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import TweetItem from "../Feed/TweetItem";
import { rooturl } from "../_config/settings";

class PeopleTweets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      tweets: []
    };
  }

  componentDidMount() {
    let username = this.props.data;
    console.log("username pressed is.....", username);
    axios
      .post(`http://${rooturl}:4500/api/tweets/getTweets`, { username })
      .then(response => {
        this.setState({
          tweets: this.state.tweets.concat(response.data)
        });
      });
  }

  render() {
    const tweets = this.state.tweets;
    let tweetContent;
    tweetContent = tweets.map(tweet => (
      <TweetItem key={tweet._id} tweet={tweet} />
    ));
    return (
      <div className="feed">
        <br />
        <div className="container">
          <div className="row">
            <div className="col-md-12">{tweetContent}</div>
          </div>
        </div>
      </div>
    );
  }
}
export default PeopleTweets;
