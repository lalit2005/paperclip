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
  const todo = await prisma.todos.update({
    where: {
      id: req.body.id,
    },
    data: {
      isDone: req.body.isDone,
    },
  });
  res.json(todo);
};

export default withApiAuthRequired(handler);
