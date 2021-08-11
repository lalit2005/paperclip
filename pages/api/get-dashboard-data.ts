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
  const notesFetcher = prisma.notes.findMany({
    where: {
      createdBy: sub,
    },
    select: {
      noteHeading: true,
      noteDescription: true,
      tags: true,
      id: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 4,
  })
  const stickyNotesFetcher = prisma.stickyNotes.findMany({
    where: {
      createdBy: sub,
    },
    select: {
      id: true,
      color: true,
      stickyNote: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  })
  const [notes, stickyNotes] = await prisma.$transaction([
    notesFetcher,
    stickyNotesFetcher,
  ])
  console.log(notes, stickyNotes)
  res.json({
    notes,
    stickyNotes,
  })
}

export default withApiAuthRequired(handler)
