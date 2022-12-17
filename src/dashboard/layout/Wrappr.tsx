import { Avatar, Card, Text, Stack } from '@kalidao/reality'

const Wrappr = () => {
  return (
    <Card padding="6">
      <Stack align="center" justify={'center'}>
        <Avatar
          src={'https://content.wrappr.wtf/ipfs/QmNndADsqj7s4NC2tRraGxhSffCbdN1eHpPdusBQE4c84k'}
          label="dao wrappr"
          size="44"
          shape="square"
        />
        <Text variant="label">Wrappr UNA (Wyoming)</Text>
      </Stack>
    </Card>
  )
}

export default Wrappr
