import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub },
  }: { user: UserProfile } = getSession(req, res);
  const { body } = req;
  const { stickyNote, id } = body;
  const newNote = await prisma.stickyNotes.update({
    where: {
      id: id,
    },
    data: {
      stickyNote: stickyNote,
    },
  });
  res.json(newNote);
};

export default withApiAuthRequired(handler);
