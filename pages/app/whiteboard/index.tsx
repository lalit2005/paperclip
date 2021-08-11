import Whiteboard from '@/components/whiteboard/Whiteboard'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

function WhiteboardPage() {
  return <Whiteboard />
}

export default withPageAuthRequired(WhiteboardPage)
