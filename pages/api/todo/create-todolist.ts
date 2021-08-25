import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub, name },
  }: { user: UserProfile } = getSession(req, res);
  const newTodoList = await prisma.todolists.create({
    data: {
      createdBy: sub,
      todolistName: req.body.todolistName,
      todolistDescription: req.body.todolistDescription,
      todos: {
        create: {
          todo: `Hey ${name}, you can put me in the "completed" bucket and earn some points 👉`,
          priority: 3,
        },
      },
    },
  });
  res.json(newTodoList);
};

export default withApiAuthRequired(handler);
