import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  UserProfile,
  withApiAuthRequired,
} from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub },
  }: { user: UserProfile } = getSession(req, res);
  const points = await prisma.pomorodoTimer.upsert({
    where: {
      userId: sub,
    },
    update: {
      points: {
        increment: 1,
      },
    },
    create: {
      userId: sub,
      points: 1,
    },
  });
  res.json(points);
};

export default withApiAuthRequired(handler);
