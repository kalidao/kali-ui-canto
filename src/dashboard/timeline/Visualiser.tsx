import { Box, Stack, Text, Heading } from '@kalidao/reality'
import { ethers } from 'ethers'

export default function Visualiser({
  type,
  accounts,
  amounts,
  payloads,
}: {
  type: number
  accounts: string[]
  amounts: string[]
  payloads: string[]
}) {
  if (type === 0) {
    return (
      <Stack>
        <Text>This will mint DAO tokens to the following accounts - </Text>
        <Box display="flex" flexDirection={'column'}>
          {accounts.map((account, index) => {
            return (
              <Box
                display={'flex'}
                gap="10"
                backgroundColor={index % 2 === 0 ? 'foregroundSecondary' : 'backgroundSecondary'}
                padding="2"
                width="fit"
              >
                <Text>{account}</Text>
                <Text weight="semiBold">{ethers.utils.formatEther(amounts[index])}</Text>
              </Box>
            )
          })}
        </Box>
      </Stack>
    )
  }

  return <Box></Box>
}
