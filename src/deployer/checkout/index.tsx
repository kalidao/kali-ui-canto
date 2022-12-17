import React, { useEffect, useState } from 'react'
import { Stack, Box, Button } from '@kalidao/reality'
import { FieldSet, Input } from '@kalidao/reality'
import { useDeployStore } from '../useDeployStore'
import Review from './Review'
import { useContractWrite } from 'wagmi'
import { contracts, FACTORY_ABI, WRAPPR_ABI } from '~/constants'
import { useRouter } from 'next/router'
import { ethers, BigNumber } from 'ethers'
import { uploadFile, uploadJSON } from '~/utils/upload'

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Checkout({ setStep }: Props) {
  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contracts[7700]['kaliFactory'],
    abi: FACTORY_ABI,
    functionName: 'deployKaliDAO',
    chainId: 7700,
  })
  const [message, setMessage] = useState<string>('')
  const state = useDeployStore((state) => state)
  const router = useRouter()
  const dao_address = useDeployStore((state) => state.dao_address)

  const deploy = async () => {
    setMessage('Preparing the summoning...')
    const { name, symbol, logo, mission, founders } = state

    // voteTime = 3 days
    const voteTime = 3 * 60 * 60 * 24
    // govSettings
    const govSettings = [voteTime, 0, 20, 52, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((x: any) =>
      BigNumber.from(x),
    ) as unknown as readonly [
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
    ]

    const extensionsArray = new Array()
    const extensionsData = new Array()

    // tribute
    extensionsArray.push(contracts[7700]['tribute'])
    extensionsData.push('0x')

    // founders
    const { voters, shares } = validateFounders(founders)

    // docs_
    // upload logo
    let docs_
    try {
      const logo_ = await uploadFile(logo)
      docs_ = await uploadJSON({
        name,
        symbol,
        logo: logo_,
        mission,
      })

      if (typeof docs_ !== 'string') {
        setMessage('Error uploading metadata ☹️')
        return
      }
    } catch (e: any) {
      console.log('error', e)
      setMessage('Error uploading metadata ☹️')
      return
    }

    // non-profit wrappr
    const iface = new ethers.utils.Interface(WRAPPR_ABI)
    const unaPayload = iface.encodeFunctionData('mint', [
      dao_address,
      BigNumber.from(ethers.utils.arrayify(dao_address)),
      BigNumber.from(1),
      ethers.constants.HashZero,
      '',
      dao_address,
    ])
    extensionsArray.push(contracts[7700]['una'])
    extensionsData.push(unaPayload)

    try {
      const tx = await writeAsync?.({
        recklesslySetUnpreparedArgs: [
          name,
          symbol,
          docs_,
          true,
          extensionsArray,
          extensionsData,
          voters,
          shares,
          govSettings,
        ],
      })
      if (tx) {
        const receipt = await tx.wait(1)
        receipt.logs.forEach(async (log: any) => {
          setMessage(`Transaction confirmed!`)
          if (log.topics[0] === '0x6742b7cc6325e167aebe51d752c19d50e2fd5eafd4256fa97d6bf589afa18af7') {
            const daoAddress = '0x' + log.topics[1].slice(-40)
            try {
              router.push(`/daos/7700/${daoAddress}`)
            } catch (e: any) {
              console.log('error', e.code, e.reason)
              setMessage(`${state.name} has been succesfully deployed. You will find it on homepage.`)
            }
          }
        })
      }
    } catch (e) {
      console.log('error', e)
      setMessage('Error! 😢')
    }

    setMessage('Summoned! 🎉')
  }

  return (
    <Stack>
      <Review />
      <Stack direction={'horizontal'} align="center" justify={'space-between'}>
        <Button variant="transparent" type="button" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button variant="primary" type="button" onClick={() => deploy()} loading={message != '' ? true : false}>
          Summon
        </Button>
      </Stack>
    </Stack>
  )
}

const validateFounders = (founders: { address: string; amount: string }[]) => {
  const voters: `0x${string}`[] = []
  const shares: BigNumber[] = []
  founders.forEach((founder: any) => {
    voters.push(founder.address)
    shares.push(ethers.utils.parseEther(founder.amount))
  })
  return { voters, shares }
}
