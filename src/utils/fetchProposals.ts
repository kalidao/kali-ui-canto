import { ethers } from 'ethers'
import { DAO_ABI } from '~/constants'
import { fetcher } from './fetcher'

export const fetchProposals = async (address: string) => {
  const provider = new ethers.providers.JsonRpcProvider('https://canto.slingshot.finance/')
  const contract = new ethers.Contract(address, DAO_ABI, provider)
  const votingPeriod = await contract.votingPeriod()
  const proposalCount = await contract.proposalCount()

  let proposals = []
  for (let i = 1; i < proposalCount; i++) {
    const proposal = await contract.proposals(i)
    const proposalState = await contract.proposalStates(i)
    const proposalArrays = await contract.getProposalArrays(i)
    const description = await fetcher(proposal.description)

    const propObj = {
      ...proposal,
      id: i,
      description: description,
      state: proposalState,
      votingEnds: new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(votingPeriod * 1000 + proposal?.creationTime * 1000),
      ),
      action: proposalArrays,
    }

    proposals.push(propObj)
  }

  return proposals
}
