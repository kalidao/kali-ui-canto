import { useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, Stack, Button, IconPencil, IconGrid } from '@kalidao/reality'
import { Layout } from '~/layout'
import * as styles from '~/design/landing.css'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.prefetch('/create')
  })

  useEffect(() => {
    router.prefetch('/')
  })

  useEffect(() => {
    router.prefetch('/explore')
  })

  const goTo = (to: string) => {
    if (to === 'explore') {
      router.push('/explore')
    }
    if (to === 'create') {
      router.push('/create')
    }
  }

  return (
    <Layout heading="Home" content="Create or join a Kali DAO.">
      <Box className={styles.container}>
        <Stack space="12">
          <Box>
            <h1 className={styles.heading}>Non-Profits on Canto.</h1>
            {/* <h1 className={styles.heading2}>Create organizations that are forever and always yours 🪄</h1> */}
            {/* <h1 className={styles.heading2}>forever & always yours ❤️</h1> */}
          </Box>
          <Box display="flex" gap="2">
            <Button prefix={<IconPencil />} variant="primary" onClick={() => goTo('create')}>
              Create
            </Button>
            {/* <Button prefix={<IconGrid />} variant="secondary" onClick={() => goTo('explore')}>
              Explore
            </Button> */}
          </Box>
        </Stack>
      </Box>
    </Layout>
  )
}

export default Home
