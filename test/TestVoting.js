const Voting = artifacts.require("Voting");
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract('TestVoting', accounts => {
    const owner = accounts[0];
    const voter = accounts[1];
    const nonVoter = accounts[2];
    const randomAccount = accounts[3];
    let votingInstance;

    /****************   ADDVOTER TESTS ***************************/

    describe("add voter test", function () {
        before(async function () {
            votingInstance = await Voting.new({from: owner});
        });

        it("should not add voter if not owner", async () => {
            await expectRevert.unspecified(
                votingInstance.addVoter(randomAccount, {from: randomAccount})
            );
        });

        it("should add voter", async () => {
            const receipt = await votingInstance.addVoter(voter, {from: owner});
            expectEvent(receipt, "VoterRegistered", {voterAddress: voter});
        });

        it("should not add voter twice", async () => {
            await expectRevert(
                votingInstance.addVoter(voter, {from: owner}),
                'Already registered'
            );
        });

        it("voter should be whitelisted", async () => {
            const receipt = await votingInstance.getVoter.call(voter, {from: voter});
            expect(receipt.isRegistered).to.be.true;
        });
    });

    /****************   VOTE ***************************/

    describe("vote test", function () {
        before(async function () {
            votingInstance = await Voting.new({from: owner});
            await votingInstance.addVoter(voter, {from: owner});
            await votingInstance.startProposalsRegistering();
            await votingInstance.addProposal('Test proposal 1', {from: voter});
            await votingInstance.addProposal('Test proposal 2', {from: voter});
            await votingInstance.addProposal('Test proposal 3', {from: voter});
            await votingInstance.endProposalsRegistering();
            await votingInstance.startVotingSession();
        });

        it("non voter should not be able to vote", async () => {
            await expectRevert(
                votingInstance.setVote(new BN(0), {from: nonVoter}),
                'You\'re not a voter'
            );
        });

        it("A voter should be able to vote", async () => {
            const receipt = await votingInstance.setVote(2, {from: voter});
            expectEvent(receipt, "Voted", {voter: voter, proposalId: new BN(2)});
        });

        it("should not add voter twice", async () => {
            await expectRevert(
                votingInstance.setVote(1, {from: voter}),
                'You have already voted'
            );
        });

        it("vote should be registered", async () => {
            const receipt = await votingInstance.getVoter.call(voter, {from: voter});
            expect(receipt.hasVoted).to.be.true;
        });
    });
});