import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const Candidate = ({ classes, name, votes, onSelect, selected }) => {
  const listClasses = [];
  if (selected) {
    listClasses.push(classes.selected);
  }
  return (
    <>
      <Divider />
      <ListItem
        role={undefined}
        dense
        button
        onClick={() => onSelect(name)}
        className={listClasses}
      >
        <Badge
          color="primary"
          badgeContent={votes}
          classes={{ badge: classes.badge }}
        >
          <ListItemText primary={name} className={classes.candidate} />
        </Badge>
      </ListItem>
    </>
  );
};

const styles = theme => ({
  badge: {
    top: 10,
    right: "auto",
    left: 0
  },
  candidate: {
    fontSize: 16,
    padding: `10px 0 10px ${theme.spacing.unit * 4}px!important`
  },
  selected: {
    background: "yellow",
    color: "white"
  }
});

const CandidateWithStyles = withStyles(styles)(Candidate);

export default CandidateWithStyles;
