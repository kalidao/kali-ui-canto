import React, { useMemo } from 'react'
import Link from 'next/link'
// import Vote from '../proposal/vote'
import { Heading, Box, Text, Tag, Card, Stack, Stat, Divider } from '@kalidao/reality'
import { truncateAddress } from '~/utils/truncateAddress'
import * as styles from './styles.css'
import { useDaoStore } from '../useDaoStore'
import Vote from './Vote'
import { ethers } from 'ethers'
import Visualiser from './Visualiser'

type Status = {
  text: string
  color: 'accent' | 'green' | 'red' | 'blue' | 'orange' | 'pink' | 'purple' | 'violet' | 'secondary' | undefined
}

// TODO
type PropCardProp = {
  proposal: any
}

const convertType = (type: number) => {
  switch (type) {
    case 0:
      return 'MINT'
    case 1:
      return 'BURN'
    case 2:
      return 'CALL'
    case 3:
      return 'VPERIOD'
    case 4:
      return 'GPERIOD'
    case 5:
      return 'QUORUM'
    case 6:
      return 'SUPERMAJORITY'
    case 7:
      return 'TYPE'
    case 8:
      return 'PAUSE'
    case 9:
      return 'EXTENSION'
    case 10:
      return 'ESCAPE'
    case 11:
      return 'DOCS'
    default:
      return 'UNKNOWN'
  }
}

export default function ProposalCard({ proposal }: PropCardProp) {
  const dao = useDaoStore((state) => state.address)

  const currentStatus = (): Status => {
    return {
      color: proposal?.state?.processed ? (proposal?.state?.passed ? 'green' : 'red') : 'blue',
      text: proposal?.state?.processed ? (proposal?.state?.passed ? 'Passed' : 'Failed') : 'Voting',
    }
  }

  const { color, text } = currentStatus()

  return (
    <Box className={styles.proposalCard}>
      <Box display="flex" flexDirection={'column'} gap="2">
        <Stack
          direction={{
            xs: 'horizontal',
          }}
          align={{ xs: 'flex-start', md: 'center' }}
          justify={'space-between'}
        >
          <Stack direction={{ xs: 'vertical', md: 'horizontal' }} align={{ xs: 'flex-start', md: 'center' }}>
            <Text size="extraLarge" color="foreground">{`#${proposal?.id} ${
              proposal?.description?.title ? proposal?.description?.title : 'Untitled'
            }`}</Text>
            <Tag tone="secondary" size="small">
              {truncateAddress(proposal?.proposer)}
            </Tag>
          </Stack>
          <Stack direction={'horizontal'}>
            <Tag label="Ends" tone={'orange'} size="medium">
              {proposal?.votingEnds.toString()}
            </Tag>
            <Tag label={convertType(proposal?.proposalType)} tone={color!} size="medium">
              {text}
            </Tag>
          </Stack>
        </Stack>
        <Text>
          {proposal?.description?.description ? proposal?.description?.description : 'No description provided.'}
        </Text>
        <Divider />
        <Visualiser
          type={proposal?.proposalType}
          accounts={proposal?.action?.accounts}
          amounts={proposal?.action?.amounts}
          payloads={proposal?.action?.payloads}
        />
      </Box>
      <Divider />
      <Stack direction={'horizontal'} align="center" justify={'space-between'}>
        <Vote id={proposal.id} />
        <Stack direction={'horizontal'}>
          <Stat size="small" label="Yes" value={ethers.utils.formatEther(proposal?.yesVotes)} />
          <Stat size="small" label="No" value={ethers.utils.formatEther(proposal?.noVotes)} />
        </Stack>
      </Stack>
    </Box>
  )
}
