import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { id, inTrash } = body;
  const playground = await prisma.codePlayground.update({
    where: {
      id: id,
    },
    data: {
      inTrash: inTrash,
    },
  });
  res.json(playground);
};

export default withApiAuthRequired(handler);
