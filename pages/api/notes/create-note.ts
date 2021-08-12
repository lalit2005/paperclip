import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/utils/prisma'
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0'
import { defaultNoteContent } from '@/components/note/defaultNoteContent'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub },
  }: { user: UserProfile } = getSession(req, res)
  const { body } = req
  const { noteDescription, noteHeading, tags } = body
  const newNote = await prisma.notes.create({
    data: {
      createdBy: sub,
      note: defaultNoteContent,
      noteDescription: noteDescription,
      noteHeading: noteHeading,
      tags: tags,
    },
  })
  res.json(newNote)
}

export default withApiAuthRequired(handler)
