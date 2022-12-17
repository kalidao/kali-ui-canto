import React, { useEffect, useState } from 'react'
import { Stack, Box, Button, MediaPicker } from '@kalidao/reality'
import { FieldSet, Input } from '@kalidao/reality'
import { useDeployStore } from './useDeployStore'

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Identity({ setStep }: Props) {
  const name = useDeployStore((state) => state.name)
  const setName = useDeployStore((state) => state.setName)
  const symbol = useDeployStore((state) => state.symbol)
  const setSymbol = useDeployStore((state) => state.setSymbol)
  const setDaoAddress = useDeployStore((state) => state.setDaoAddress)
  const [nameError, setNameError] = useState('')
  const [symbolError, setSymbolError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateName = () => {
    if (name == '') {
      setNameError('Name is required')
    } else {
      setNameError('')
    }
  }

  const validateSymbol = () => {
    if (symbol == '') {
      setSymbolError('Symbol is required')
    } else {
      setSymbolError('')
    }
  }

  const submit = async () => {
    if (name === '' || symbol === '') return
    setLoading(true)
    await setDaoAddress(name)
    setStep(1)
    setLoading(false)
  }

  return (
    <Box>
      <FieldSet
        legend="Token"
        description="Your token is the identity of your organization. The token created will be ERC20 compliant."
      >
        <Input
          label="Name"
          placeholder="KaliCo"
          defaultValue={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
          onBlur={validateName}
          error={nameError}
          required
        />
        <Input
          label="Symbol"
          placeholder="KCO"
          prefix="$"
          textTransform="uppercase"
          defaultValue={symbol}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymbol(e.currentTarget.value)}
          onBlur={validateSymbol}
          required
          error={symbolError}
        />
        <Stack direction={'horizontal'} justify="flex-end">
          <Button variant="primary" type="submit" onClick={submit} loading={loading}>
            Next
          </Button>
        </Stack>
      </FieldSet>
    </Box>
  )
}
