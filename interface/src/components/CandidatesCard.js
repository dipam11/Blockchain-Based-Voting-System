import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";

import Candidate from "./Candidate";

import applyContext from "./Context";

class CadidatesCard extends Component {
  state = {
    candidate: ""
  };

  selectCandidate = candidate => {
    this.props.user.registration === "approved" &&
      !this.props.user.voted &&
      this.setState({ candidate });
  };

  vote = () => {
    this.props.vote(this.state.candidate);
    this.setState({ candidate: "" });
  };

  render() {
    const { classes, candidates, user, messages } = this.props;
    return (
      <>
        <Typography
          variant="h5"
          component="h1"
          className={classes.electorTitle}
        >
          {messages.electorTitle}
        </Typography>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2" className={classes.title}>
              {candidates.length > 0
                ? messages.candidatesTitle
                : messages.noCandidates}
            </Typography>
            <List>
              {candidates.map((item, index) => (
                <Candidate
                  onSelect={this.selectCandidate}
                  selected={
                    !user.voted &&
                    user.registration === "approved" &&
                    this.state.candidate === item.name
                  }
                  key={`candidate-${index}`}
                  name={item.name}
                  votes={item.votes}
                />
              ))}
            </List>
            {user.voted && (
              <Typography variant="h6" component="h2" className={classes.title}>
                {messages.thanksVoted}
              </Typography>
            )}
            {user.registration === "pendingApproval" && (
              <Typography variant="h6" component="h2" className={classes.title}>
                {messages.pendingApproval}
              </Typography>
            )}
          </CardContent>

          {user.registration === "approved" &&
            !user.voted && (
              <Button
                disabled={!this.state.candidate}
                variant="contained"
                color="primary"
                onClick={this.vote}
                className={classes.button}
              >
                {messages.voteButton}
              </Button>
            )}
        </Card>
      </>
    );
  }
}
const styles = () => ({
  electorTitle: {
    marginTop: 60
  },
  title: {
    padding: "20px 0"
  },
  card: {
    marginTop: 20,
    minWidth: 275,
    width: "80vw"
  },
  button: {
    margin: "20px auto",
    display: "block"
  }
});

const CadidatesCardStyled = withStyles(styles)(CadidatesCard);

export default applyContext(CadidatesCardStyled);
