import { Stack, Card, Heading, Input } from '@kalidao/reality'

const Propose = () => {
  return (
    <Card padding="6" width="full">
      <Stack>
        <Heading>Make a Proposal</Heading>
        <Input label="Title" />
      </Stack>
    </Card>
  )
}

export { Propose }
