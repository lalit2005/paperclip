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
  const {
    body: { id },
  } = req;
  const todoList = await prisma.todolists.findMany({
    where: {
      createdBy: sub,
      inTrash: false,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  console.log(todoList);
  res.json(todoList);
};

export default withApiAuthRequired(handler);
