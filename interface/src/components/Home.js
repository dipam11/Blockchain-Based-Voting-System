import React from "react";
import { withStyles } from "@material-ui/core/styles";

import CandidatesCard from "./CandidatesCard";
import AdminArea from "./AdminArea";
import UserArea from "./UserArea";

import TopBar from "./TopBar";
import Error from "./Error";

import applyContext from "./Context";

const Home = props => {
  const { classes, user, messages } = props;
  return (
    <div className={classes.root}>
      <TopBar />
      <div className={classes.main}>
        {user.address ? (
          <>
            <CandidatesCard />
            <UserArea />
            {user.admin && <AdminArea />}
          </>
        ) : (
          <Error message={messages.homeError} />
        )}
      </div>
    </div>
  );
};

const styles = () => ({
  root: {
    minHeight: "100vh",
    flex: 1,
    flexGrow: 1,
    background: "#d3d3d3"
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
});

const StyledHome = withStyles(styles)(Home);
export default applyContext(StyledHome);
