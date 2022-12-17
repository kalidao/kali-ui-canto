import React, { useState } from 'react'
import { useContractWrite } from 'wagmi'
import { DAO_ABI} from '~/constants/'
import { useRouter } from 'next/router'
import { createProposal } from './createProposal'
import { FieldSet, Text, Input, Button, Stack, IconClose, IconUserSolid } from '@kalidao/reality'
import { ethers } from 'ethers'
import Back from '~/design/Back'
import { ProposalProps } from './types'
import { useForm, useFieldArray } from 'react-hook-form'
import { useDaoStore } from '../useDaoStore'

interface FormData {
  members: { address: string; share: string }[]
}

export default function AddMembers({ setProposal, content, title }: ProposalProps) {
  const router = useRouter()
  const dao = useDaoStore((state) => state.address)
  const [loading, setLoading] = useState(false)
  // form
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      members: [{ address: ethers.constants.AddressZero, share: '1000' }],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  })


  const {
    isSuccess: isProposeSuccess,
    isError: isProposeError,
    error: proposeError,
    isLoading: isProposePending,
    writeAsync: propose,
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: dao as string,
    abi: DAO_ABI,
    functionName: 'propose',
  })

  const submit = async (data: FormData) => {
    if (!propose || !dao) return // wallet not ready to submit on chain
    setLoading(true)

    let docs
    try {
      docs = await createProposal(dao as string, 7700, 0, title, content)
    } catch (e) {
      console.error(e)
      return
    }

    const recipients = data.members.map((member) => member.address as `0xstring`)
    const shares = data.members.map((member) => ethers.utils.parseEther(member.share.toString())) 
    const payloads = data.members.map((member) => ethers.constants.AddressZero as `0xstring`)
   
    if (docs) {
      try {
        const tx = await propose({
          recklesslySetUnpreparedArgs: [0, docs, recipients, shares, payloads],
        })
        
        if (tx) {
            await tx.wait(1).then(() => {
                router.push(`/daos/7700/${dao}/`)
            })
        }
        console.log('tx', tx)
      } catch (e) {
        console.log('error', e)
      }
    }
    setLoading(false)
  }

  return (
    <Stack>
      <FieldSet
        legend="Mint Tokens"
        description="This will create a proposal to create and give tokens to the recipient."
      >
             <Stack justify="flex-start">
        {fields.map((item, index) => {
          return (
            <Stack key={item.id} direction="horizontal" align="center" justify="center">
              <Input
                label={`Member`}
                hideLabel={index !== 0}
                id="member"
                {...register(`members.${index}.address` as const, {
                  required: true,
                })}
                defaultValue={item.address}
                type="text"
              />
              <Input
                label="Tokens"
                hideLabel={index !== 0}
                id="share"
                type="number"
                {...register(`members.${index}.share` as const, {
                  required: true,
                  min: 1,
                })}
                defaultValue={item.share}
              />
              <Button
                tone="red"
                variant="secondary"
                size="small"
                shape="circle"
                onClick={(e) => {
                  e.preventDefault()
                  remove(index)
                }}
              >
                <IconClose />
              </Button>
            </Stack>
          )
        })}
        <Button
          suffix={<IconUserSolid />}
          variant="secondary"
          tone="green"
          onClick={(e) => {
            e.preventDefault()
            append({
              address: '',
              share: '1000',
            })
          }}
        >
          Add
        </Button>
      </Stack>
      </FieldSet>
      <Stack direction={'horizontal'} justify="space-between">
        <Back onClick={() => setProposal?.('menu')} />
        <Button
        center
        variant="primary"
        onClick={handleSubmit(submit)}
        loading={loading || isProposePending}
        disabled={!propose || isProposePending || isProposeSuccess}
        >
        {isProposePending ? 'Submitting...' : 'Submit'}
        </Button>
      </Stack>
      <Text>
        {isProposeSuccess
          ? 'Proposal submitted on chain!'
          : isProposeError && `Error submitting proposal: ${proposeError}`}
      </Text>
    </Stack>
  )
}
