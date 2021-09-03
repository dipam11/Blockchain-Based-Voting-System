import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import applyContext from "./Context";

class TopBar extends Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = language => {
    this.props.setLanguage(language);
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, messages, language } = this.props;
    const { anchorEl } = this.state;

    return (
      <AppBar className={classes.bar} position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {messages.dappName}
          </Typography>
          <Button
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
            className={classes.language}
          >
            {language === "en" ? "English" : "Português (BR)"}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={() => this.handleClose("en")}>English</MenuItem>
            <MenuItem onClick={() => this.handleClose("pt")}>
              Português (BR)
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

const styles = () => ({
  bar: {
    height: 70
  },
  grow: {
    flexGrow: 1
  },
  language: {
    color: "white"
  }
});

const TopBarStyled = withStyles(styles)(TopBar);
export default applyContext(TopBarStyled);
