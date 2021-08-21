import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/utils/prisma'
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.boardId.toString() !== 'undefined' || null || '' || undefined) {
    const {
      user: { sub },
    }: { user: UserProfile } = getSession(req, res)
    const board = await prisma.whiteboards.findFirst({
      where: {
        id: req.query.boardId.toString(),
        createdBy: sub,
      },
    })
    res.json(board)
  } else {
    res.status(404).json({ message: 'Board not found' })
  }
}

export default withApiAuthRequired(handler)
