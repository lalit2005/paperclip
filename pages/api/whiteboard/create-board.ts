import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/utils/prisma'
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0'
import initialData from '@/components/whiteboard/initialBoardData'
import generateInitialWhiteboardContent from '@/lib/generate-initial-whiteboard-content'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub, name, email },
  }: { user: UserProfile } = getSession(req, res)
  const { body } = req
  const { boardName, boardDescription } = body
  const newBoard = await prisma.whiteboards.create({
    data: {
      elements: JSON.stringify(generateInitialWhiteboardContent(name)),
      appState: JSON.stringify({
        zenModeEnabled: false,
      }),
      createdBy: sub,
      boardName: boardName,
      boardDescription: boardDescription,
    },
  })
  res.json(newBoard)
}

export default withApiAuthRequired(handler)
