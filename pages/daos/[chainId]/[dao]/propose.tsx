import { NextPage } from 'next'
import Layout from '~/dashboard/layout'
import { Box } from '@kalidao/reality'
import { Propose } from '~/dashboard/propose'

const ProposePage: NextPage = () => {
  return (
    <Layout heading={'Propose'} content="Create a new proposal.">
      <Propose />
    </Layout>
  )
}

export default ProposePage
