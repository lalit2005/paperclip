import React, { useEffect, useState, useRef, Fragment } from 'react';
import Excalidraw from './Excalidraw';
import { Dialog, Transition } from '@headlessui/react';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { AppState } from '@excalidraw/excalidraw/types/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import Script from 'next/script';

const Whiteboard: React.FC<{
  initialData: { elements?: ExcalidrawElement[]; appState?: AppState };
  id: string;
}> = ({ initialData, id }) => {
  const excalidrawRef = useRef(null);
  console.log(initialData, id);
  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  // appState and boardState are same - the current state of the app
  // const [boardState, setBoardState] = useState<AppState>(initialData.appState)
  let boardState = initialData.appState;
  let setBoardState = (state: AppState) => {
    boardState = state;
  };
  let elementsState = initialData.elements;
  let setElementsState = (state: ExcalidrawElement[]) => {
    elementsState = state;
  };

  // const [elementsState, setElementsState] = useState<ExcalidrawElement[]>(
  // initialData.elements
  // )
  let [isOpen, setIsOpen] = useState(false);
  const [addedButton, setAddedButton] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get('addLibrary');
      if (libraryUrl) {
        excalidrawRef.current!.importLibrary(libraryUrl, hash.get('token'));
      }
    };
    window.addEventListener('hashchange', onHashChange, false);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  // useEffect(() => {
  //   const btn: HTMLButtonElement = document.querySelector(
  //     '#whiteboard-save-btn'
  //   );
  //   btn &&
  //     btn?.addEventListener('click', () => {
  //       const updateReq = axios.post('/api/whiteboard/update-board', {
  //         elements: elementsState,
  //         appState: boardState,
  //         id,
  //       });
  //       toast.promise(updateReq, {
  //         error: 'There was an error saving your changes.',
  //         success: 'Your changes have been saved.',
  //         loading: 'Saving your changes...',
  //       });
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.metaKey && e.key === 'h') {
        setIsOpen(true);
      }
      if (e.metaKey && e.key === 'B') {
        const updateReq = axios.post('/api/whiteboard/update-board', {
          elements: elementsState,
          appState: boardState,
          id,
        });
        toast.promise(updateReq, {
          error: 'There was an error saving your changes.',
          success: 'Your changes have been saved.',
          loading: 'Saving your changes...',
        });
        alert('Saving your changes...');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='App'>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={() => {
            setIsOpen(false);
          }}>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Dialog.Overlay className='fixed inset-0 backdrop-filter backdrop-blur-lg' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className='inline-block h-screen align-middle'
              aria-hidden='true'>
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white border border-gray-100 rounded shadow-xl'>
                {/* <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900">
                  Payment successful
                </Dialog.Title> */}
                <div className='flex mt-2 text-gray-800 justify-left'>
                  <button
                    className='px-1 py-1 mr-4 bg-gray-100 border border-gray-300 rounded-sm'
                    onClick={() => setViewModeEnabled(!viewModeEnabled)}>
                    View mode
                  </button>

                  <button
                    className='px-1 py-1 mr-4 bg-gray-100 border border-gray-300 rounded-sm'
                    onClick={() => setZenModeEnabled(!zenModeEnabled)}>
                    Zen mode
                  </button>

                  <button
                    className='px-1 py-1 mr-4 bg-gray-100 border border-gray-300 rounded-sm'
                    onClick={() => setGridModeEnabled(!gridModeEnabled)}>
                    Grid mode
                  </button>
                </div>

                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-1 text-sm font-medium text-gray-900 border border-gray-500 rounded-sm hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500'
                    onClick={() => {
                      setIsOpen(false);
                    }}>
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className='w-screen h-screen'>
        {/* <button
          onClick={() => {
            
          }}>
          <h1 className='font-bold text-7xl'>Export</h1>
        </button> */}
        <Excalidraw
          innerRef={excalidrawRef}
          initialData={{
            elements: elementsState,
            appState: boardState,
          }}
          autofocus={true}
          onChange={(
            newElements: readonly ExcalidrawElement[],
            newAppState: AppState
          ) => {
            // @ts-ignore
            setElementsState(newElements);
            setBoardState(newAppState);
            // window.navigator.clipboard.writeText(JSON.stringify(elementsState));
            window.localStorage.setItem(
              id,
              JSON.stringify({
                elements: elementsState,
                appState: boardState,
                id: id,
              })
            );
            if (!addedButton) {
              console.log(
                'Elements :',
                newElements,
                '\n',
                'State : ',
                newAppState
              );
              const box = document.querySelector('.Stack .Stack_horizontal');
              const btn = document.createElement('button');
              btn.innerHTML = 'Save';
              btn.id = 'whiteboard-save-btn';
              btn.className +=
                ' !py-2 ml-2 !px-3 !bg-gray-900 !text-gray-50 border-white';
              box.appendChild(btn);
              btn.onclick = () => {
                alert(window.localStorage.getItem(id));
                const latestData = JSON.parse(window.localStorage.getItem(id));
                const updateReq = axios.post(
                  '/api/whiteboard/update-board',
                  latestData
                );
                toast.promise(updateReq, {
                  error: 'There was an error saving your changes.',
                  success: 'Your changes have been saved.',
                  loading: 'Saving your changes...',
                });
              };
              setAddedButton(true);
            }
          }}
          handleKeyboardGlobally={false}
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
          export={false}
        />
      </div>
    </div>
  );
};
export default Whiteboard;
