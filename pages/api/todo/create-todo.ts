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
  const newTodo = await prisma.todos.create({
    data: {
      todolistId: req.body.todolistId,
      todo: req.body.todo,
      priority: req.body.priority,
    },
  });
  res.json(newTodo);
};

export default withApiAuthRequired(handler);
