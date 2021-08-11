import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/utils/prisma'
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub },
  }: { user: UserProfile } = getSession(req, res)
  const notes = await prisma.notes.findMany({
    where: {
      createdBy: sub,
    },
  })
  res.json(notes)
}

export default withApiAuthRequired(handler)
