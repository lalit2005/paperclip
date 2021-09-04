import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { id, inTrash } = body;
  const trashNotes = await prisma.todolists.update({
    where: {
      id: id,
    },
    data: {
      inTrash: inTrash,
    },
  });
  res.json(trashNotes);
};

export default withApiAuthRequired(handler);
