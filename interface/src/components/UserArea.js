import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Button from "@material-ui/core/Button";

import applyContext from "./Context";

class UserArea extends Component {
  render() {
    const { classes, user, messages } = this.props;
    if (user.registration === "pendingRegistration") {
      return (
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2" className={classes.title}>
              {messages.requestTitle}
            </Typography>
            <Typography variant="h6" component="h5" className={classes.title}>
              {messages.ethAddress} {user.address}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={this.props.requestApproval}
              className={classes.button}
            >
              {messages.requestAccessButton}
            </Button>
          </CardContent>
        </Card>
      );
    }
    return null;
  }
}
const styles = () => ({
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
  },
  textField: {
    width: "100%"
  }
});

const UserAreaStyled = withStyles(styles)(UserArea);

export default applyContext(UserAreaStyled);
