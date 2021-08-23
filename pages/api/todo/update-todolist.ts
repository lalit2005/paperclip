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
  const newTodoList = await prisma.todolists.update({
    where: {
      id: body.id,
    },
    data: {
      todolistName: body.todolistName,
      todolistDescription: body.todolistDescription,
    },
  });
  res.json(newTodoList);
};

export default withApiAuthRequired(handler);
