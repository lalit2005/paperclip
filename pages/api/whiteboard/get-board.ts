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
  const board = await prisma.whiteboards.findFirst({
    where: {
      id: req.query.boardId.toString(),
      createdBy: sub,
    },
  });
  res.json(board);
};

export default withApiAuthRequired(handler);
