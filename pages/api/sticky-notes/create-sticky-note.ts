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
  const { stickyNote, color } = body;
  const newStickyNote = await prisma.stickyNotes.create({
    data: {
      createdBy: sub,
      color: color,
      stickyNote: stickyNote,
    },
  });
  res.json(newStickyNote);
};

export default withApiAuthRequired(handler);
