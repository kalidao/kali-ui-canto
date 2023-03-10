import { Button, IconCheck, IconClose, Stack } from '@kalidao/reality'
import { ethers } from 'ethers'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { DAO_ABI } from '~/constants'
import { useDaoStore } from '../useDaoStore'

export default function Vote({ id }: { id: number }) {
  const dao = useDaoStore((state) => state.address)
  const { config: process, error: processError } = usePrepareContractWrite({
    address: dao,
    abi: DAO_ABI,
    chainId: 7700,
    functionName: 'processProposal',
    args: [ethers.BigNumber.from(id)],
  })
  const { config: yes, error: yesError } = usePrepareContractWrite({
    address: dao,
    abi: DAO_ABI,
    chainId: 7700,
    functionName: 'vote',
    args: [ethers.BigNumber.from(id), true],
  })
  const { config: no, error: noError } = usePrepareContractWrite({
    address: dao,
    abi: DAO_ABI,
    chainId: 7700,
    functionName: 'vote',
    args: [ethers.BigNumber.from(id), false],
  })
  const { write: processWrite, isSuccess: processSuccess, isLoading: processLoading } = useContractWrite(process)
  const { write: yesWrite, isSuccess: yesSuccess, isLoading: yesLoading } = useContractWrite(yes)
  const { write: noWrite, isSuccess: noSuccess, isLoading: noLoading } = useContractWrite(no)

  console.log('process', processError)
  if (processWrite) {
    return (
      <Button
        size="small"
        tone="blue"
        variant="secondary"
        loading={processLoading}
        disabled={!processWrite || processSuccess}
        onClick={() => processWrite?.()}
      >
        Process
      </Button>
    )
  }

  return (
    <Stack direction={'horizontal'}>
      <Button
        size="small"
        shape="circle"
        tone="blue"
        variant="secondary"
        loading={yesLoading}
        disabled={!yesWrite || yesSuccess}
        onClick={() => yesWrite?.()}
      >
        <IconCheck />
      </Button>
      <Button
        size="small"
        shape="circle"
        tone="red"
        variant="secondary"
        loading={noLoading}
        disabled={!noWrite || noSuccess}
        onClick={() => noWrite?.()}
      >
        <IconClose />
      </Button>
    </Stack>
  )
}
