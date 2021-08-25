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
  const playground = await prisma.codePlayground.findFirst({
    where: {
      id: req.query.playgroundId.toString(),
      createdBy: sub,
    },
  });
  res.json(playground);
};

export default withApiAuthRequired(handler);
