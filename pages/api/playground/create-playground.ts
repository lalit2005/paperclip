import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0';
import getTagsFromString from '@/lib/get-tags-from-string';
import { customAlphabet } from 'nanoid';
import generateDefaultPlaygroundData from '@/lib/generate-default-playground-data';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub, name, nickname, picture },
  }: { user: UserProfile } = getSession(req, res);
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-';
  const nanoid = customAlphabet(alphabet, 10);
  const newPlayground = await prisma.codePlayground.create({
    data: {
      createdBy: sub,
      playgroundName: req.body.playgroundName,
      tags: getTagsFromString(req.body.tags),
      publicId: nanoid(),
      html: generateDefaultPlaygroundData(name, picture, nickname).HTML,
      css: generateDefaultPlaygroundData(name, picture, nickname).CSS,
      js: generateDefaultPlaygroundData(name, picture, nickname).JS,
    },
  });
  res.json(newPlayground);
};

export default withApiAuthRequired(handler);
