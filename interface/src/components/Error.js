import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

const Error = props => {
  const { classes, message } = props;
  return (
    <Typography variant="h6" color="inherit" className={classes.error}>
      {message}
    </Typography>
  );
};

const styles = () => ({
  error: {
    flexGrow: 1,
    padding: 20,
    color: "red",
    textAlign: "center"
  }
});

export default withStyles(styles)(Error);
