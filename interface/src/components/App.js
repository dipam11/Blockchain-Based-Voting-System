import React, { Component } from "react";
import Web3 from "web3";
import utils from "web3-utils";
import { uniq } from "lodash";

import abi from "../election-abi.json";

import { Provider } from "./Context";

import Home from "./Home";

import CONTRACT from "../contract-address";

import MESSAGES from "../messages";

export default class AppProvider extends Component {
  constructor(props) {
    super(props);

    const state = {
      language: "en",
      user: {},
      candidates: [],
      pendingVoters: []
    };

    if (window.web3) {
      state.web3 = new Web3(window.web3.currentProvider);
      state.contract = new state.web3.eth.Contract(abi, CONTRACT);
    }

    this.state = state;
  }

  async componentDidMount() {
    this.getContractState();

    this.timeout = setInterval(() => this.getContractState(), 2000);
  }

  componentWillUnmount() {
    this.timeout && this.timeout();
  }

  async getContractState() {
    const { web3, contract } = this.state;
    if (web3 && contract) {
      try {
        const userAddress = await web3.eth.getCoinbase();
        const registered = await contract.methods
          .voterIsRegistered(userAddress)
          .call();

        const owner = await contract.methods.owner().call();
        const userData = {
          registration: registered ? "pendingApproval" : "pendingRegistration",
          admin: owner.toLowerCase() === userAddress.toLowerCase(),
          address: userAddress.toLowerCase()
        };
        if (registered) {
          const approved = await contract.methods
            .registrationIsApproved(userAddress)
            .call();
          if (approved) {
            userData.registration = "approved";
            const hasVoted = await contract.methods
              .voterHasVoted(userAddress)
              .call();
            userData.voted = hasVoted;
          }
        }
        const candidates = await this.fetchCandidates(this.state.contract);
        const pendingVoters = await this.fetchPendingVoters();
        this.setState({
          pendingVoters: uniq(pendingVoters),
          candidates,
          user: userData
        });
      } catch (err) {
        console.warn("err: ", err);
      }
    }
  }

  async fetchCandidates() {
    const { contract } = this.state;
    const candidates = [];
    const count = await contract.methods.getCandidateCount().call();
    for (let i = 0; i < count; i++) {
      const bytesName = await contract.methods
        .getCandidateNameForIndex(i)
        .call();
      const votes = await contract.methods
        .getVoteCountForCandidate(bytesName)
        .call();
      candidates.push({
        name: utils.hexToUtf8(bytesName),
        votes
      });
    }
    return candidates;
  }

  async fetchPendingVoters() {
    const { contract } = this.state;
    const registrations = [];
    const count = await contract.methods.getRegistrationCount().call();
    for (let i = 0; i < count; i++) {
      const address = await contract.methods.getRegistrationForIndex(i).call();
      const registered = await contract.methods
        .registrationIsApproved(address)
        .call();
      if (!registered) {
        registrations.push(address);
      }
    }
    return registrations;
  }

  // Web3 Calls

  vote = async name => {
    const { contract } = this.state;
    if (!contract) return new Error("Not connected to Web3");
    const hexName = utils.utf8ToHex(name);
    const address = this.state.user.address;
    return new Promise((resolve, reject) => {
      contract.methods
        .voteForCandidate(hexName)
        .send({ from: address })
        .on("error", error => {
          reject(error);
        })
        .on("receipt", receipt => {
          resolve(receipt);
        });
    });
  };

  approve = async address => {
    const { contract } = this.state;
    if (!contract) return new Error("Not connected to Web3");
    const ownAddr = this.state.user.address;
    return new Promise((resolve, reject) => {
      contract.methods
        .approveRegistration(address)
        .send({ from: ownAddr })
        .on("error", error => {
          reject(error);
        })
        .on("receipt", receipt => {
          resolve(receipt);
        });
    });
  };

  addCandidate = async name => {
    const { contract } = this.state;
    if (!contract) return new Error("Not connected to Web3");
    const hexName = utils.utf8ToHex(name);
    const address = this.state.user.address;
    return new Promise((resolve, reject) => {
      contract.methods
        .addCandidate(hexName)
        .send({ from: address })
        .on("error", error => {
          reject(error);
        })
        .on("receipt", receipt => {
          resolve(receipt);
          this.getContractState();
        });
    });
  };

  requestApproval = async () => {
    const { contract } = this.state;
    if (!contract) return new Error("Not connected to Web3");
    const address = this.state.user.address;
    return new Promise((resolve, reject) => {
      contract.methods
        .registerVoter()
        .send({ from: address })
        .on("error", error => {
          reject(error);
        })
        .on("receipt", receipt => {
          resolve(receipt);
        });
    });
  };

  batchApprove = async voters => {
    const { contract } = this.state;
    if (!contract) return new Error("Not connected to Web3");
    const ownAddr = this.state.user.address;
    return new Promise((resolve, reject) => {
      contract.methods
        .approveRegistrations(voters)
        .send({ from: ownAddr })
        .on("error", error => {
          reject(error);
        })
        .on("receipt", receipt => {
          resolve(receipt);
        });
    });
  };

  setLanguage = language => {
    this.setState({ language });
  };

  // Render

  render() {
    if (!this.state.web3) {
      return <span>{MESSAGES.en.homeError}</span>;
    }
    return (
      <Provider
        value={{
          vote: this.vote,
          approve: this.approve,
          requestApproval: this.requestApproval,
          addCandidate: this.addCandidate,
          batchApprove: this.batchApprove,
          messages: MESSAGES[this.state.language],
          setLanguage: this.setLanguage,
          ...this.state
        }}
      >
        <Home />
      </Provider>
    );
  }
}
