import React, { Component } from "react";
import { findIndex } from "lodash";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import applyContext from "./Context";

class AdminArea extends Component {
  state = {
    checked: [],
    name: ""
  };

  toggleItem = item => {
    if (this.state.checked.indexOf(item) !== -1) {
      this.setState({
        checked: this.state.checked.filter(value => value !== item)
      });
    } else {
      this.setState({
        checked: [...this.state.checked, item]
      });
    }
  };

  approve = () => {
    this.props.batchApprove(this.state.checked);
    this.setState({
      checked: []
    });
  };

  setName = event => {
    this.setState({ name: event.target.value });
  };

  registerCandidate = () => {
    this.props.addCandidate(this.state.name.substring(0, 32));
    this.setState({ name: "" });
  };

  render() {
    const { classes, pendingVoters, messages } = this.props;
    return (
      <>
        <Typography variant="h5" component="h1" className={classes.adminTile}>
          {messages.admTitle}
        </Typography>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2" className={classes.title}>
              {messages.electorsWaiting}
            </Typography>

            <List>
              {pendingVoters.map(item => (
                <ListItem
                  key={item}
                  role={undefined}
                  dense
                  button
                  onClick={() => this.toggleItem(item)}
                >
                  <Checkbox
                    checked={this.state.checked.indexOf(item) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
            <Button
              disabled={this.state.checked.length === 0}
              variant="contained"
              color="primary"
              onClick={this.approve}
              className={classes.button}
            >
              {messages.approveButton}
            </Button>
          </CardContent>
        </Card>

        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2" className={classes.title}>
              {messages.addCandidateTitle}
            </Typography>
            <TextField
              required
              onChange={this.setName}
              id="outlined-required"
              label={messages.candidateField}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={this.state.name}
            />
            <Button
              disabled={
                this.state.name.length === 0 ||
                findIndex(
                  this.props.candidates,
                  item => item.name === this.state.name
                ) >= 0
              }
              variant="contained"
              color="primary"
              onClick={this.registerCandidate}
              className={classes.button}
            >
              {messages.saveButton}
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }
}
const styles = () => ({
  adminTile: {
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
  },
  textField: {
    width: "100%"
  }
});

const AdminAreaStyled = withStyles(styles)(AdminArea);

export default applyContext(AdminAreaStyled);
