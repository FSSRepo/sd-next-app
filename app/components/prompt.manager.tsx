'use client'
import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PresentData } from '../models/present';
import { useParameters } from '../models/parameter.provider';

export default function PromptManager() {
  let { params, setParams } = useParameters();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [prompts, setPrompts] = useState<PresentData[]>([
    { prompt: 'cute cat', negative_prompt: '', cfg: 7, name: 'Default'}
  ]);

  const [selectedPrompt, setSelectedPrompt] = useState(0)
  const [namePrompt, setNamePrompt] = useState("");

  const saveNewPrompt = () => {
    if(!prompts.some(prompt => prompt.name === namePrompt)) {
      let newPrompt: PresentData = {
        name: namePrompt,
        prompt: params.prompt,
        negative_prompt: params.negative_prompt,
        cfg: params.cfg_scale
      };
      setPrompts([...prompts, newPrompt]);
      setSelectedPrompt(prompts.length - 1);
    }
  };

  const editPrompt = () => {
    let copy = [...prompts]
    copy[selectedPrompt].prompt = params.prompt;
    copy[selectedPrompt].negative_prompt = params.negative_prompt;
    copy[selectedPrompt].cfg = params.cfg_scale;
    setPrompts(copy);
  };

  const useThisPrompt = () => {
    setParams({
      ...params,
      prompt: prompts[selectedPrompt].prompt,
      negative_prompt: prompts[selectedPrompt].negative_prompt,
      cfg_scale: prompts[selectedPrompt].cfg
    })
    setModalOpen(false)
  };

  const deletePrompt = () => {
    if(selectedPrompt > 0) {
      let copy = [...prompts.filter((p,i) => selectedPrompt != i)];
      setSelectedPrompt(selectedPrompt - 1);
      setPrompts(copy);
    }
  };

  useEffect(() => {
    let saved_data = localStorage.getItem("prompts_saved");
    if(saved_data) {
      setPrompts([...JSON.parse(saved_data).prompts])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("prompts_saved", JSON.stringify({ prompts }));
  }, [prompts])

  useEffect(() => {
    setNamePrompt(prompts[selectedPrompt].name);
  }, [selectedPrompt, prompts]);

  return (
    <div className="inline-block">
      <a
        onClick={() => {
          setModalOpen(true);
        }}
        className="p-1 inline-block mb-3 cursor-pointer rounded-lg dark:bg-slate-800 border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      >
        <svg
          className="inline-block w-5 h-5 mr-2 dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
        <span className={`dark:text-white`}>Prompt Manager</span>
      </a>
      <Transition show={modalOpen} as={Fragment} afterEnter={() => {}}>
        <Dialog onClose={() => setModalOpen(false)}>
          {/* Modal backdrop */}
          <Transition.Child
            className="fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            aria-hidden="true"
          />
          {/* End: Modal backdrop */}

          {/* Modal dialog */}
          <Transition.Child
            className="fixed inset-0 z-10 flex p-6"
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 scale-75"
            enterTo="opacity-100 scale-100"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-75"
          >
            <div className="min-w-full mx-auto h-full flex items-center">
              <Dialog.Panel className="w-full rounded-3xl shadow-2xl bg-black">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="popup-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="p-6 w-full">
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Prompt Manager
                    </h3>
                    <div className="grid grid-rows-1 grid-cols-2 grid-flow-col gap-4 mb-2 w-full">
                      <div className="text-sm col-span-1 font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {prompts.map((element, index) => (
                          <a
                            key={index}
                            href="#"
                            onClick={() => {
                              setSelectedPrompt(index);
                            }}
                            className={
                              (selectedPrompt === index
                                ? "bg-blue-700 text-white"
                                : "") +
                              " block w-full px-4 py-2 border-b border-gray-200 rounded-t-lg cursor-pointer dark:bg-gray-800 dark:border-gray-600"
                            }
                          >
                            {element.name}
                          </a>
                        ))}
                      </div>
                      <div className="col-span-2">
                        <div className="justify-between mb-4 rounded-t sm:mb-5">
                          <div className="text-lg text-gray-900 md:text-xl dark:text-white">
                            <h3 className="font-bold">
                              {prompts[selectedPrompt].name}
                            </h3>
                          </div>
                          <div></div>
                        </div>
                        <dl>
                          <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                            Prompt
                          </dt>
                          <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                            {prompts[selectedPrompt].prompt}
                          </dd>
                          <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                            Negative prompt
                          </dt>
                          <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                            {prompts[selectedPrompt].negative_prompt}
                          </dd>
                          <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                            CFG Scale
                          </dt>
                          <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                            {prompts[selectedPrompt].cfg}
                          </dd>
                        </dl>
                        <button
                          type="button"
                          onClick={useThisPrompt}
                          className="inline-flex items-center bg-white border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          Use this prompt
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <input
                          type="text"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setNamePrompt(e.target.value);
                          }}
                          placeholder="Name"
                          value={namePrompt}
                          className="bg-gray-50 border w-52 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={editPrompt}
                          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          <svg
                            aria-hidden="true"
                            className="mr-1 -ml-1 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                            <path
                              fill-rule="evenodd"
                              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={saveNewPrompt}
                          className="py-2.5 px-5 inline-flex text-white text-sm font-medium focus:outline-none bg-green-600 rounded-lg border border-gray-200 hover:bg-green-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 -ml-1 w-4 h-4"
                            viewBox="0 0 32 32"
                          >
                            <title>{"save-floppy"}</title>
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M18 5a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V5Zm-9 7h14a1 1 0 0 0 1-1V0H8v11a1 1 0 0 0 1 1ZM28 0h-2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V0H4a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4Z"
                            />
                          </svg>
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={deletePrompt}
                          className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                        >
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 mr-1.5 -ml-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
          {/* End: Modal dialog */}
        </Dialog>
      </Transition>
    </div>
  );
}