import React, { useEffect, useState, useRef, Fragment } from 'react'
import Excalidraw from './Excalidraw'
import InitialData from './initialData'
import { Dialog, Transition } from '@headlessui/react'

export default function App() {
  const excalidrawRef = useRef(null)

  const [viewModeEnabled, setViewModeEnabled] = useState(false)
  const [zenModeEnabled, setZenModeEnabled] = useState(false)
  const [gridModeEnabled, setGridModeEnabled] = useState(false)

  let [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'z') {
        setIsOpen(true)
      }
    })
    return
  }, [])

  return (
    <div className='App'>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={() => {
            setIsOpen(false)
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
                      setIsOpen(false)
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
        <Excalidraw
          innerRef={excalidrawRef}
          initialData={InitialData}
          // onChange={(elements, state) =>
          //   console.log("Elements :", elements, "State : ", state)
          // }
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
        />
      </div>
    </div>
  )
}

/* <div className="absolute z-50 text-4xl font-semibold button-wrapper top-40 left-40">
        <button
          className="reset-scene"
          onClick={() => {
            excalidrawRef.current.resetScene();
          }}>
          Reset Scene
        </button>
        <label>
          <input
            type="checkbox"
            checked={viewModeEnabled}
            onChange={() => setViewModeEnabled(!viewModeEnabled)}
          />
          View mode
        </label>
        <label>
          <input
            type="checkbox"
            checked={zenModeEnabled}
            onChange={() => setZenModeEnabled(!zenModeEnabled)}
          />
          Zen mode
        </label>
        <label>
          <input
            type="checkbox"
            checked={gridModeEnabled}
            onChange={() => setGridModeEnabled(!gridModeEnabled)}
          />
          Grid mode
        </label>
      </div> */
