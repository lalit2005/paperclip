import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0';
import { defaultNoteContent } from '@/components/note/defaultNoteContent';
import getTagsFromString from '@/lib/get-tags-from-string';
import { customAlphabet } from 'nanoid';
import generateDefaultContent from '@/lib/generate-default-content';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub, name, email },
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
      html: `<h1>Hello ${name} 👋</h1>`,
      css: `html {font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;}`,
    },
  });
  res.json(newPlayground);
};

export default withApiAuthRequired(handler);
