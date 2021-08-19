import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/utils/prisma'
import {
  withApiAuthRequired,
  UserProfile,
  getSession,
} from '@auth0/nextjs-auth0'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req
  const { id } = body
  const {
    user: { sub },
  }: { user: UserProfile } = getSession(req, res)
  const trashNotesRequest = prisma.notes.findMany({
    where: {
      id: id,
      createdBy: sub,
      inTrash: true,
    },
  })
  const [trashNotes] = await prisma.$transaction([trashNotesRequest])
  res.json({
    notes: trashNotes,
  })
}

export default withApiAuthRequired(handler)
