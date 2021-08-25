import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  withApiAuthRequired,
  getSession,
  UserProfile,
} from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub },
  }: { user: UserProfile } = getSession(req, res);
  const trashPlaygrounds = await prisma.codePlayground.deleteMany({
    where: {
      createdBy: sub,
      inTrash: true,
    },
  });
  res.json(trashPlaygrounds);
};

export default withApiAuthRequired(handler);
