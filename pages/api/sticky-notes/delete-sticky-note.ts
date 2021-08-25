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
  const deletedNote = await prisma.stickyNotes.delete({
    where: {
      id: id,
    },
  });
  res.json(deletedNote);
};

export default withApiAuthRequired(handler);
