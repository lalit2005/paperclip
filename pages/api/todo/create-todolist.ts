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
  const newTodoList = await prisma.todolists.create({
    data: {
      createdBy: sub,
      todolistName: req.body.todolistName,
      todolistDescription: req.body.todolistDescription,
      todos: {
        create: {
          todo: 'Hello world',
        },
      },
    },
  });
  res.json(newTodoList);
};

export default withApiAuthRequired(handler);
