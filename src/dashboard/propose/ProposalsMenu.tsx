import { IconUserGroupSolid, Stack } from '@kalidao/reality'
import { Item } from './Item'

export default function ProposalsMenu({ setProposal }: { setProposal: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <Stack wrap>
      <Item onClick={() => setProposal('addMembers')} label="Add Member" icon={<IconUserGroupSolid />} />
    </Stack>
  )
}
