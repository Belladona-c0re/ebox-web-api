import { Injectable } from '@angular/core';
import { ContractService } from './contract.service';

@Injectable({
    providedIn: 'root'
})
export class GovernanceService {

    endpoint = 'https://www.ethbox.org/gov/voting.php';

    constructor(private contractServ: ContractService) { }

    async getVotings(options) {

        let formData = new FormData();
        formData.append('action', 'get_votings');
        
        if (options.isCommunity) {
            formData.append('community', '1');
        }

        let response = await fetch(this.endpoint, { method: 'POST', body: formData });
        let { data: proposals } = await response.json();

        // Parsing answers from string to array
        proposals.forEach(proposal =>
            proposal.answers = JSON.parse(proposal.answers));
        return proposals;
    }

    async isEligible(options) {

        let formData = new FormData();
        formData.append('action', 'is_eligible');
        formData.append('voting', options.votingNumber);
        formData.append('address', this.contractServ.selectedAccount$.getValue());
        
        if (options.isCommunity) {
            formData.append('community', '1');
        }

        let response = await fetch(this.endpoint, { method: 'POST', body: formData });
        let { result: isEligible } = await response.json();
        return isEligible;
    }

    async hasVoted(options) {

        let formData = new FormData();
        formData.append('action', 'has_voted');
        formData.append('voting', options.votingNumber);
        formData.append('address', this.contractServ.selectedAccount$.getValue());

        if (options.isCommunity) {
            formData.append('community', '1');
        }

        let response = await fetch(this.endpoint, { method: 'POST', body: formData });
        let { result: hasVoted } = await response.json();
        return hasVoted;
    }

    async getVotes(options) {

        let formData = new FormData();
        formData.append('action', 'get_votes');
        formData.append('voting', options.votingNumber);

        if (options.isCommunity) {
            formData.append('community', '1');
        }

        let response = await fetch(this.endpoint, { method: 'POST', body: formData });
        let { data: votes } = await response.json();

        return {
            sum: votes.reduce((a, b) => a + b.answer, 0),
            votes
        };
    }

    async getVoters(options) {

        let formData = new FormData();
        formData.append('action', 'get_voters');
        formData.append('voting', options.votingNumber);

        if (options.isCommunity) {
            formData.append('community', '1');
        }

        let response = await fetch(this.endpoint, { method: 'POST', body: formData });
        let { data: eligibleUsers } = await response.json();
        return eligibleUsers
            .sort((a, b) => b.voting_power - a.voting_power);
    }

    async getVotesDetails(options) {

        let formData = new FormData();
        formData.append('action', 'get_votes_detail');
        formData.append('voting', options.votingNumber);

        if (options.isCommunity) {
            formData.append('community', '1');
        }

        let response = await fetch(this.endpoint, { method: 'POST', body: formData });
        let { data: votesDetail } = await response.json();
        return votesDetail;
    }

    async vote(proposal, selectedChoice) {

        let selectedAccount = this.contractServ.selectedAccount$.getValue();

        let response: any = await this.contractServ
            .signMessage(`ethbox Vote #${proposal.n}`);
        let signedMessage = response.result;

        console.log('Signed message is', signedMessage);

        this.castVote(
            proposal,
            selectedChoice,
            selectedAccount,
            signedMessage);
    }

    private async castVote(proposal, vote, account, signedMessage) {

        console.log('Proposal is', proposal);
        console.log('Choosen vote is', vote);
        console.log('Connected account is', account);
        console.log('Signed message is', signedMessage);

        let formData = new FormData();
        formData.append('action', 'cast_vote');
        formData.append('voting', proposal.n);
        formData.append('address', account);
        formData.append('signed_msg', signedMessage);
        formData.append('vote', vote);

        // I have no idea what's the response looks like (json or text or both depending on the execution?)
        let response = await fetch(this.endpoint, { method: 'POST', body: formData });
        return response;
    }

}
