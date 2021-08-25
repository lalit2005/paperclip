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
  const playgrounds = await prisma.codePlayground.findMany({
    where: {
      createdBy: sub,
      inTrash: false,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  res.json(playgrounds);
};

export default withApiAuthRequired(handler);
