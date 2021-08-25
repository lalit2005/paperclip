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
  const stickyNotes = await prisma.notes.findFirst({
    where: {
      id: req.query.noteId.toString(),
      createdBy: sub,
    },
  });
  res.json(stickyNotes);
};

export default withApiAuthRequired(handler);
