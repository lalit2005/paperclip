import { customAlphabet } from 'nanoid';

const getNewWhiteboardUrl = () => {
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = (len) => customAlphabet(alphabet, len);
  const whiteboardUrl = `https://excalidraw.com/#room=${nanoid(20)()},${nanoid(
    22
  )()}`;
  return whiteboardUrl;
};

export default getNewWhiteboardUrl;
