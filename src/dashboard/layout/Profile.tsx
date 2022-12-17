import { Avatar, Box, Card, Heading, Skeleton, Spinner, Stack, Text, Button, Divider } from '@kalidao/reality'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useDaoStore } from '../useDaoStore'
import { useEffect } from 'react'

const Profile = () => {
  const router = useRouter()
  const chainId = useDaoStore((state) => state.chainId)
  const address = useDaoStore((state) => state.address)
  const setToken = useDaoStore((state) => state.setToken)
  const token = useDaoStore((state) => state.token)
  const setMeta = useDaoStore((state) => state.setMeta)
  const meta = useDaoStore((state) => state.meta)

  useEffect(() => {
    if (!address) return
    setToken(address)
  }, [address, setToken])

  useEffect(() => {
    if (!address || token.docs === '') return
    setMeta(token.docs)
  }, [token.docs, address, setMeta])

  if (token.name === '' || token.symbol === '')
    return (
      <Card padding="6" width="full" shadow hover>
        <Spinner />
      </Card>
    )

  console.log('meta', meta, token)

  return (
    <Card padding="6" width="full">
      <Stack
        direction={'horizontal'}
        align={router.asPath === `/daos/${chainId}/${address}` ? 'center' : 'flex-start'}
        justify={router.asPath === `/daos/${chainId}/${address}` ? 'center' : 'space-between'}
      >
        <Box width="full" display="flex" alignItems="center" justifyContent={'center'}>
          <Stack align="center" justify={'center'}>
            <Avatar src={meta?.logo} label="dao profile pic" address={address as string} size="32" />
            <Heading>
              {token?.name} ({token?.symbol})
            </Heading>
            <Text>{meta?.mission}</Text>
          </Stack>
        </Box>
      </Stack>
    </Card>
  )
}

export default Profile
