import { useState } from 'react'
import { Text, Box, Heading } from '@kalidao/reality'
import { Progress } from '~/design/Progress'
import Identity from './Identity'
import Metadata from './Metadata'
import Members from './Members'
import Checkout from './checkout'
import * as styles from './styles.css'

// TODO:
// Allow interaction with outside from within the modal
export default function DeployerWrapper() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      component: <Identity setStep={setStep} />,
      title: 'Summon',
      description: `You are about to summon a KaliDAO, an on-chain organization 
      with a native token, voting mechanism, and legal structure. To get 
      started, pick a name and symbol for your DAO and Token.`,
    },
    {
      component: <Metadata setStep={setStep} />,
      title: 'Metadata',
      description: `Specify the initial members of your DAO.`,
    },
    {
      component: <Members setStep={setStep} />,
      title: 'Members',
      description: `Specify the initial members of your DAO.`,
    },
    {
      component: <Checkout setStep={setStep} />,
      title: 'Checkout',
      description: `Updates to the DAO require proposals, i.e., 
      minting tokens, amending quorum, etc.`,
    },
  ]

  return (
    <Box className={styles.container}>
      <Progress value={(step / (steps.length - 1)) * 100} />
      {steps[step]['component']}
    </Box>
  )
}
