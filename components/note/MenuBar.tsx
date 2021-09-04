import { Editor } from '@tiptap/react';
import { BiItalic, BiBold, BiPaint } from 'react-icons/bi';
import { FaRemoveFormat, FaMinus, FaListUl, FaListOl } from 'react-icons/fa';
import { FiCode, FiLink2, FiYoutube } from 'react-icons/fi';
import { MdStrikethroughS } from 'react-icons/md';
import { AiOutlineHighlight, AiOutlineTable } from 'react-icons/ai';
import { CgQuoteO } from 'react-icons/cg';
import {
  HiOutlineCode,
  HiOutlineX,
  HiOutlineDesktopComputer,
  HiOutlinePhotograph,
  HiOutlineMinusCircle,
  HiOutlineXCircle,
  HiOutlinePlusCircle,
  HiOutlineExternalLink,
  HiOutlineInformationCircle,
} from 'react-icons/hi';
import Draggable from 'react-draggable';
import * as Portal from '@radix-ui/react-portal';

// load all highlight.js languages
import saveNote from '@/lib/save-note';
import MenuBarTooltip from './Tooltip';
import generateEmbedUrl from '@/lib/generate-embed-url';
import { customAlphabet } from 'nanoid';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import CustomTooltip from './Tooltip';

const MenuBar: React.FC<{ editor: Editor; noteId: string }> = ({
  editor,
  noteId,
  ...props
}) => {
  if (!editor) {
    return <>Loading...</>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ytVideo, setYtVideo] = useState<{
    displayVideo: boolean;
    url: string;
  }>({
    displayVideo: false,
    url: '',
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isVideMinimized, setIsVideMinimized] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    window.onkeydown = (e) => {
      // if Cmd/Ctrl + M is pressed, toggle the video minimized state
      if (e.key === 'm' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsVideMinimized((prev) => !prev);
      }
      // if cmd/ctrl + shift + space is pressed, toggle the video minimized state
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // alert('hi');
        document
          .querySelector<HTMLIFrameElement>('#yt-video-iframe')
          .contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          );
      }

      if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // alert('f');
        document
          .querySelector<HTMLIFrameElement>('#yt-video-iframe')
          .contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            '*'
          );
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        {...props}
        className='flex flex-row flex-wrap py-3 mb-8 bg-white border border-gray-700 rounded shadow-inner justify-evenly gap-x-2 px-7 menu-bar'>
        <MenuBarTooltip text='Bolden selected text'>
          <button
            id='bold-btn'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive('bold')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <BiBold />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Italicize selected text'>
          <button
            id='italic-btn'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive('italic')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <BiItalic />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Strike selected text'>
          <button
            id='strike-btn'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={
              editor.isActive('strike')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <MdStrikethroughS />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Convert selected text to inline code'>
          <button
            id='code-btn'
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={
              editor.isActive('code')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <FiCode />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Remove all formatting'>
          <button
            id='remove-format-btn'
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            className=' hover:bg-gray-200'>
            <FaRemoveFormat />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Heading 1'>
          <button
            id='h1-btn'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive('heading', { level: 1 })
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <strong>H1</strong>
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Heading 2'>
          <button
            id='h2-btn'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive('heading', { level: 2 })
                ? 'is-active'
                : '' + ` hover:bg-gray-200 `
            }>
            <strong>H2</strong>
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Heading 3'>
          <button
            id='h3-btn'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive('heading', { level: 3 })
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <strong>H3</strong>
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Add unordered list'>
          <button
            id='ul-btn'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive('bulletList')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <FaListUl />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Add ordered list'>
          <button
            id='ol-btn'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive('orderedList')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <FaListOl />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Add code block'>
          <button
            id='code-block-btn'
            onClick={() => editor.chain()?.focus()?.toggleCodeBlock()?.run()}
            className={
              editor.isActive('codeBlock')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <HiOutlineCode />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Blockquote'>
          <button
            id='quote-btn'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={
              editor.isActive('blockquote')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <CgQuoteO />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Add a divider'>
          <button
            id='hr-btn'
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className='hover:bg-gray-200'>
            <FaMinus />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Add Image'>
          <button
            onClick={() => {
              const url = window.prompt('URL');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className={
              editor.isActive('image')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <HiOutlinePhotograph />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Add Table'>
          <button
            onClick={() => {
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run();
            }}
            className={
              editor.isActive('image')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <AiOutlineTable />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Convert selected text to link'>
          <button
            onClick={() => {
              let url = window.prompt('URL');
              url = url.toString().startsWith('http') ? url : 'http://' + url;
              editor.chain().focus().setLink({ href: url }).run();
            }}
            className={
              editor.isActive('link')
                ? 'is-active'
                : '' + '  hover:bg-gray-200 '
            }>
            <FiLink2 />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Embed any website'>
          <button
            onClick={() => {
              let embedUrl = window.prompt('URL');
              embedUrl = embedUrl.toString().startsWith('http')
                ? embedUrl
                : 'http://' + embedUrl;
              editor
                .chain()
                .focus()
                .setIframe({ src: generateEmbedUrl(embedUrl) })
                .run();
            }}>
            <HiOutlineDesktopComputer />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Add a whiteboard in notes 🤯'>
          <button
            onClick={() => {
              const alphabet =
                '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
              const nanoid = (len) => customAlphabet(alphabet, len);
              const whiteboardUrl = `https://excalidraw.com/#room=${nanoid(
                20
              )()},${nanoid(22)()}`;
              editor.chain().focus().setIframe({ src: whiteboardUrl }).run();
            }}>
            <BiPaint />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip text='Highlight selected text'>
          <button
            onClick={() => {
              editor.chain().focus().toggleHighlight().run();
            }}
            className={
              editor.isActive('blockquote')
                ? 'is-active'
                : '' + '  hover:bg-gray-200'
            }>
            <AiOutlineHighlight />
          </button>
        </MenuBarTooltip>
        <MenuBarTooltip
          text={
            ytVideo.displayVideo
              ? 'Close the currently playing YouTube video.'
              : 'Play YouTube while writing notes'
          }>
          <button
            onClick={() => {
              if (ytVideo.displayVideo) {
                setYtVideo({
                  ...ytVideo,
                  displayVideo: false,
                });
              } else {
                let videoUrl = window.prompt('URL/link of the YouTube Video');
                videoUrl = videoUrl.toString().startsWith('http')
                  ? videoUrl
                  : 'http://' + videoUrl;
                if (new URL(videoUrl).hostname === 'www.youtube.com') {
                  const params = new URL(videoUrl).searchParams;
                  setYtVideo({
                    displayVideo: true,
                    url: `https://www.youtube-nocookie.com/embed/${params.get(
                      'v'
                    )}`,
                  });
                }
              }
            }}
            className={
              editor.isActive('blockquote')
                ? 'is-active'
                : '' + '  hover:bg-gray-200'
            }>
            {ytVideo.displayVideo ? <HiOutlineX /> : <FiYoutube />}
          </button>
        </MenuBarTooltip>
        {/* <MenuBarTooltip text='Save note. You can also press Cmd/Ctrl + S to save.'>
          <div
            onClick={() => {
              saveNote(noteId, editor);
            }}
            className='px-2 py-1 text-white bg-gray-600 rounded shadow hover:text-gray-100 hover:!bg-gray-500'>
            Save
          </div>
        </MenuBarTooltip> */}
      </div>
      {ytVideo.displayVideo && (
        <Portal.Root>
          <Draggable>
            <div
              className={clsx(
                'fixed w-[672px] transition-all duration-500 shadow-2xl rounded-br-md cursor-move',
                isVideMinimized ? 'h-0' : 'h-[378px]'
              )}>
              <div className='flex items-center justify-between w-full px-2 py-1 text-sm text-gray-500 bg-white'>
                <p className='mr-4'>
                  https://youtube.com/watch?v={ytVideo.url.split('embed/')[1]}
                </p>
                <div>
                  <HiOutlineXCircle
                    onClick={() => {
                      setYtVideo({
                        ...ytVideo,
                        displayVideo: false,
                      });
                    }}
                    title='Close the video'
                    style={{ zoom: '1.3' }}
                    className='inline-block w-4 h-4 p-px mx-1 text-red-600 rounded-full cursor-pointer hover:bg-red-100'
                  />
                  {isVideMinimized ? (
                    <button
                      className='inline-block'
                      onClick={() => {
                        setIsVideMinimized(false);
                      }}
                      id='maximize-icon'>
                      <HiOutlinePlusCircle
                        title='Maximize the video'
                        style={{ zoom: '1.3' }}
                        className='inline-block w-4 h-4 p-px mx-1 text-green-600 rounded-full cursor-pointer hover:bg-green-100'
                      />
                    </button>
                  ) : (
                    <button
                      className='inline-block'
                      onClick={() => {
                        setIsVideMinimized(true);
                      }}
                      id='minimize-icon'>
                      <HiOutlineMinusCircle
                        title='Minimize the video'
                        style={{ zoom: '1.3' }}
                        className='inline-block w-4 h-4 p-px mx-1 text-green-600 transition-all duration-500 rounded-full cursor-pointer hover:bg-green-100'
                      />
                    </button>
                  )}
                  <span className='inline-block'>
                    <CustomTooltip
                      text='Press Cmd/Ctrl + M to minimize and maximize the video'
                      showArrow>
                      <HiOutlineInformationCircle
                        title='Some shortcuts to boost your productivity'
                        style={{ zoom: '1.3' }}
                        className='inline-block w-4 h-4 p-px mx-1 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100'
                      />
                    </CustomTooltip>
                  </span>
                </div>
              </div>

              <iframe
                src={ytVideo.url}
                frameBorder='0'
                draggable
                title='YouTube video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                id='yt-video-iframe'
                allowFullScreen
                className={clsx(
                  'rounded-br-md w-full h-full',
                  isVideMinimized && 'opacity-0'
                )}>
                Loading...
              </iframe>
            </div>
          </Draggable>
        </Portal.Root>
      )}
    </div>
  );
};

export default MenuBar;
