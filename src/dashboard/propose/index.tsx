import { useState } from 'react'
import { Stack, Card, FieldSet, Heading, Input, Textarea } from '@kalidao/reality'
import ProposalsMenu from './ProposalsMenu'
import AddMembers from './AddMembers'

const Propose = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [proposal, setProposal] = useState('menu')

  const proposals: {
    [key: string]: {
      component: React.ReactNode
    }
  } = {
    menu: {
      component: <ProposalsMenu setProposal={setProposal} />,
    },
    addMembers: {
      component: <AddMembers setProposal={setProposal} content={content} title={title} />,
    },
  }

  return (
    <Card padding="6">
      <Stack align="center" space="10">
        <FieldSet legend="Make a Proposal">
          <Input
            label="Title"
            type="text"
            inputMode="text"
            name="id"
            placeholder={'Proposal for...'}
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            required
          />
          <Textarea
            label="Details"
            description="You can provide context for this proposal here."
            onChange={(e) => setContent(e.currentTarget.value)}
          />
          {proposals[proposal]['component']}
        </FieldSet>
      </Stack>
    </Card>
  )
}

export { Propose }
