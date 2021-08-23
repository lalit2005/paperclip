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

  const deleteTodoRequest = prisma.todos.deleteMany({
    where: {
      todolistId: id,
    },
  });

  const deleteTodoListRequest = prisma.todolists.delete({
    where: {
      id: req.body.id,
    },
  });
  const [_, deleteTodoList] = await prisma.$transaction([
    deleteTodoRequest,
    deleteTodoListRequest,
  ]);
  res.json(deleteTodoList);
};

export default withApiAuthRequired(handler);
