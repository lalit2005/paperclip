import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  withApiAuthRequired,
  getSession,
  UserProfile,
} from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const {
    user: { sub },
  }: { user: UserProfile } = getSession(req, res);
  const trashNotes = await prisma.notes.deleteMany({
    where: {
      createdBy: sub,
      inTrash: true,
    },
  });
  res.json(trashNotes);
};

export default withApiAuthRequired(handler);
