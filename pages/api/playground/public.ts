import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { id, isPlaygroundPublic } = body;
  console.log(isPlaygroundPublic);
  const publicPlayground = await prisma.codePlayground.update({
    where: {
      id,
    },
    data: {
      isPublic: isPlaygroundPublic,
    },
  });
  res.json(publicPlayground);
};

export default withApiAuthRequired(handler);
