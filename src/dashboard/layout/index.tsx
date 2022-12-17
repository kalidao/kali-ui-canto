import { useRouter } from 'next/router'
import { Layout, LayoutProps } from '~/layout'
import { Box, Stack } from '@kalidao/reality'
import * as styles from './styles.css'
import { useEffect } from 'react'
import { useDaoStore } from '../useDaoStore'
import Profile from './Profile'
import Wrappr from './Wrappr'

export default function DashboardLayout({ heading, content, children }: LayoutProps) {
  const router = useRouter()
  const { dao } = router.query
  const setAddress = useDaoStore((state) => state.setAddress)

  useEffect(() => {
    if (!dao) return
    setAddress(dao as string)
  }, [dao, setAddress])

  return (
    <Layout heading={heading} content={content}>
      <Box className={styles.container}>
        <Stack>
          <Stack
            direction={{
              xs: 'vertical',
              lg: 'horizontal',
            }}
            justify="space-between"
          >
            <Profile />
            <Wrappr />
          </Stack>
          {children}
        </Stack>
      </Box>
    </Layout>
  )
}
