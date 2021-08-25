import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { id } = body;
  const deletedNote = await prisma.notes.delete({
    where: {
      id: id,
    },
  });
  res.json(deletedNote);
};

export default withApiAuthRequired(handler);
