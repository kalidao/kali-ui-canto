import React, { useMemo } from 'react'
import Link from 'next/link'
// import Vote from '../proposal/vote'
import { Heading, Box, Text, Tag, Card, Stack, Stat } from '@kalidao/reality'
import { truncateAddress } from '~/utils/truncateAddress'
import * as styles from './styles.css'
import { useDaoStore } from '../useDaoStore'
import Vote from './Vote'
import { ethers } from 'ethers'

type Status = {
  text: string
  color: 'accent' | 'green' | 'red' | 'blue' | 'orange' | 'pink' | 'purple' | 'violet' | 'secondary' | undefined
  icon: React.ReactNode
}

// TODO
type PropCardProp = {
  proposal: any
}

export default function ProposalCard({ proposal }: PropCardProp) {
  const dao = useDaoStore((state) => state.address)

  const currentStatus = (): Status => {
    // unsponsored
    if (!proposal?.sponsored) {
      return {
        color: 'secondary',
        icon: <></>,
        text: 'Unsponsored',
      }
    }
    // voting
    const timeLeft =
      new Date().getTime() - new Date(proposal?.dao?.votingPeriod * 1000 + proposal?.votingStarts * 1000).getTime()
    if (proposal?.sponsored === true) {
      if (timeLeft > 0) {
        if (proposal?.status === null) {
          return {
            color: 'accent',
            icon: <></>,
            text: 'Process',
          }
        } else {
          return {
            color: proposal?.status ? 'green' : 'red',
            icon: <></>,
            text: proposal?.status ? 'Passed' : 'Failed',
          }
        }
      } else {
        return {
          color: 'accent',
          icon: <></>,
          text: 'Voting',
        }
      }
    }
    // execute

    return {
      color: undefined,
      icon: <></>,
      text: '...',
    }
  }

  const { color, text } = currentStatus()

  return (
    <Box className={styles.proposalCard}>
      <Link
        href={{
          pathname: '/daos/[chainId]/[dao]/proposals/[proposalId]',
          query: {
            dao: dao as string,
            chainId: '7700',
            proposalId: proposal?.id,
          },
        }}
        passHref
      >
        <a className={styles.linkStyle}>
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
            <Tag label={proposal['proposalType']} tone={color!} size="medium">
              {text}
            </Tag>
          </Stack>
          <Text>
            {proposal?.description?.description ? proposal?.description?.description : 'No description provided.'}
          </Text>
        </a>
      </Link>
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
