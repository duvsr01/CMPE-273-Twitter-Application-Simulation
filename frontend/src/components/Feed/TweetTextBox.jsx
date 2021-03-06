import React, { Component } from "react";
import { connect } from "react-redux";
import { addTweet } from "../_actions/tweetAction";

class TweetTextBox extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      upload: "",
      textError: "",
      loading: false,
      hashtag: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  

  onSubmit = e => {
    e.preventDefault();
    const { user } = this.props.auth;
    var hashtag = this.state.hashtag;
    var hashtagArr = hashtag.split(',');
    const newTweet = {
      tweet_content: this.state.text,
      user_id: user.id,
      username: user.username,
      firstname: user.first_name,
      lastname: user.last_name,
      avatar: user.avatar,
      hashtag: hashtagArr
    };

    this.props.addTweet(newTweet);
    this.setState({ text: "" });
  };

  render() {
    let button;
    if (this.state.text.length > 0 && this.state.text.length <= 280) {
      button = (
        <button
          type="submit"
          className="btn btn-primary"
          onClick={this.props.handleFormClose}
        >
          Tweet
        </button>
      );
    } else {
      button = (
        <div className="animated lightSpeedIn">
          <button type="submit" className="btn btn-primary" disabled="true">
            {" "}
            Tweet
          </button>
          <button type="submit" className="btn btn-primary" disabled="true">
            {" "}
            Upload
          </button>
        </div>
      );
    }
    return (
      <div className="card w-95">
        <div className="card-body">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="Whats happening?"
                name="text"
                value={this.state.text}
                onChange={this.onChange}
              />
            </div>
            <textarea 
                className=""
                placeholder="Hastags"
                name="hashtag"
                value={this.state.hashtag}
                onChange={this.onChange}
                rows="1" cols="50"
              />
            {button}
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  tweetState: state.tweetState,
  errors: state.errorState
});
export default connect(mapStateToProps, { addTweet })(TweetTextBox);
