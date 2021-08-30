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
  const points = await prisma.pomorodoTimer.findUnique({
    where: {
      userId: sub,
    },
  });
  console.log(points);
  res.json(points);
};

export default withApiAuthRequired(handler);
