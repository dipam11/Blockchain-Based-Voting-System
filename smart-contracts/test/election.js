const Election = artifacts.require('Election');
const BigNumber = web3.BigNumber

contract('Election', (accounts) => {
  let instance;
  let owner = accounts[0];
  let notOwner = accounts[1];
  let voter = accounts[2];
  let unregistered = accounts[3];
  let unapproved = accounts[4];

  beforeEach(async () => {
    instance = await Election.deployed();
  });

  describe('ownership rules', () => {
    it('should not allow anyone but the contract owner to add a candidate', async () => {
      try {
        await instance.addCandidate('George Washington', {from: notOwner});
      } catch (e) {
        assert.equal(e.message, 'VM Exception while processing transaction: revert');
      }
    });

    it('should allow the contract owner to add a candidate', async () => {
      await instance.addCandidate('George Washington');
    });

    it('should allow anyone to register to vote', async () => {
      await instance.registerVoter({from: voter});
    });

    it('should allow owner to approve registrations', async() => {
      await instance.registerVoter({from: voter});
      await instance.approveRegistration(voter, {from: owner});
    });

    it('should allow owner to approve several registrations at once', async() => {
      await instance.registerVoter({from: voter});
      await instance.approveRegistrations([voter, voter], {from: owner});
    });

    it('should not allow anyone but the contract owner to approve registrations', async() => {
      try {
        await instance.registerVoter({from: voter});
        await instance.approveRegistration(voter, {from: notOwner});
      } catch (e) {
        assert.equal(e.message, 'VM Exception while processing transaction: revert');
      }
    });

    it('should not allow anyone but the contract owner to approve several registrations at once', async() => {
      try {
        await instance.registerVoter({from: voter});
        await instance.approveRegistrations([voter, voter], {from: owner});
      } catch (e) {
        assert.equal(e.message, 'VM Exception while processing transaction: revert');
      }
    });
  });

  describe('candidates', () => {
    it('adding a candidate should increase the candidate count', async () => {
      const candidateCount = await instance.getCandidateCount();
      await instance.addCandidate('George Washington');
      const newCandidateCount = await instance.getCandidateCount();
      assert(candidateCount.lt(newCandidateCount));
    });

    it('can be enumerated', async () => {
      let startingIndex = await instance.getCandidateCount();
      await instance.addCandidate('George Washington');
      await instance.addCandidate('Thomas Jefferson');
      await instance.addCandidate('James Madison');
      let candidate = web3.toUtf8(await instance.getCandidateNameForIndex(startingIndex));
      assert.equal(candidate, 'George Washington');
      candidate = web3.toUtf8(await instance.getCandidateNameForIndex(startingIndex.plus(1)));
      assert.equal(candidate, 'Thomas Jefferson');
      candidate = web3.toUtf8(await instance.getCandidateNameForIndex(startingIndex.plus(2)));
      assert.equal(candidate, 'James Madison');
      const candidateCount = await instance.getCandidateCount();
      assert(candidateCount.eq(startingIndex.plus(3)));
    });
  });

  describe('registerVoter', () => {
    it('should add the voter to the list', async () => {
      await instance.registerVoter({from: voter});
      const registered = await instance.voterIsRegistered.call(voter);
      assert(registered);
    });

    it("voters aren't registered by default", async () => {
      const registered = await instance.voterIsRegistered.call(unregistered);
      assert(registered === false);
    });

    it('adding a registration should increase the registration count', async () => {
      const registrationCount = await instance.getRegistrationCount();
      await instance.registerVoter({from: voter});
      const newRegistrationCount = await instance.getRegistrationCount();
      assert(registrationCount.lt(newRegistrationCount));
    });

    it('registrations can be enumerated', async () => {
      let startingIndex = await instance.getRegistrationCount();
      await instance.registerVoter({from: voter});
      let registration = await instance.getRegistrationForIndex(startingIndex);
      assert.equal(registration, voter);
      let endingIndex = await instance.getRegistrationCount();
      assert(endingIndex.eq(startingIndex.plus(1)));
    });
  });

  describe('approveRegistration', () => {
    it("registrations aren't approved by default", async () => {
      await instance.registerVoter({from: voter});
      const approved = await instance.registrationIsApproved.call(voter);
      assert(approved === false);
    });

    it("works properly when called by contract owner on registered voter", async () => {
      await instance.registerVoter({from: voter});
      await instance.approveRegistration(voter, {from: owner});
      const approved = await instance.registrationIsApproved.call(voter);
      assert(approved);
    });

    it("works when called on several voters at once", async () => {
      await instance.registerVoter({from: voter});
      await instance.approveRegistrations([voter, voter], {from: owner});
      const approved = await instance.registrationIsApproved.call(voter);
      assert(approved);
    });
  });

  describe('voteForCandidate', () => {
    it("fails if candidate doesn't exist", async () => {
      try {
        await instance.voteForCandidate('George Washington', {from: voter});
      } catch (e) {
        assert.equal(e.message, 'VM Exception while processing transaction: revert No candidate found with that name.');
      }
    });

    it("Doesn't increment the candidate's vote count if the voter isn't registered.", async () => {
      await instance.addCandidate('George Washington', {from: owner});
      const voteCount = await instance.getVoteCountForCandidate('George Washington');
      await instance.voteForCandidate('George Washington', {from: unregistered});
      const newVoteCount = await instance.getVoteCountForCandidate('George Washington');
      assert(voteCount.eq(newVoteCount));
    });

    it("Doesn't increment the candidate's vote count if the voter isn't approved.", async () => {
      await instance.addCandidate('George Washington', {from: owner});
      await instance.registerVoter({from: unapproved});
      const voteCount = await instance.getVoteCountForCandidate('George Washington');
      await instance.voteForCandidate('George Washington', {from: unapproved});
      const newVoteCount = await instance.getVoteCountForCandidate('George Washington');
      assert(voteCount.eq(newVoteCount));
    });

    it("Increments the candidate's vote count if the voter is approved.", async () => {
      await instance.addCandidate('George Washington', {from: owner});
      await instance.registerVoter({from: voter});
      await instance.approveRegistration(voter, {from: owner});
      const voteCount = await instance.getVoteCountForCandidate('George Washington');
      await instance.voteForCandidate('George Washington', {from: voter});
      const newVoteCount = await instance.getVoteCountForCandidate('George Washington');
      assert(voteCount.lt(newVoteCount));
    });

    it("Doesn't let a person vote twice.", async () => {
      await instance.addCandidate('George Washington', {from: owner});
      await instance.registerVoter({from: voter});
      await instance.approveRegistration(voter, {from: owner});
      const voteCount = await instance.getVoteCountForCandidate('George Washington');
      await instance.voteForCandidate('George Washington', {from: voter});
      await instance.voteForCandidate('George Washington', {from: voter});
      const newVoteCount = await instance.getVoteCountForCandidate('George Washington');
      assert(voteCount.plus(new BigNumber(1)).eq(newVoteCount));
    });
  });
});
