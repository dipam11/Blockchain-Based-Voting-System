import React, { createContext } from "react";
import MESSAGES from "../messages";

export const { Provider, Consumer } = createContext({
  language: "en",
  messages: MESSAGES.en,
  user: {},
  candidates: [],
  pendingVoters: [],
  vote: candidate => {
    return null;
  },
  approve: voter => {
    return null;
  },
  requestApproval: voter => {
    return null;
  },
  setLanguage: language => {}
});

export default Component => {
  return props => (
    <Consumer>{value => <Component {...props} {...value} />}</Consumer>
  );
};
