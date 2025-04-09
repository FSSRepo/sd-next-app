'use client'
import { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { GenerationParams } from '../models/gen_params';
import { useParameters } from '../models/parameter.provider';
import axios from 'axios';
import { useProcess } from '../models/process.provider';
import API_URL from '../api';
import { toast } from 'react-hot-toast';

interface Model {
  title: string,
  model_name: string
}

interface Sampler {
  name: string
}

export default function ModelSettings() {
  let {  params, setParams } = useParameters();
  let { p_params, setProcessParams } = useProcess();
  const [models, setModels] = useState<Model[]>([]);
  const [samplers, setSamplers] = useState<Sampler[]>([]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const newParams: GenerationParams = { ...params, [e.target.name]: e.target.value };
    setParams(newParams);
  };
  useEffect(() => {
    axios.get(API_URL + 'sd-models').then(res => {
      setModels(res.data as Model[])
    }).catch(err => {
      toast.error("Stable Diffusion Server connection error", { position: 'top-left'})
    });
    axios.get(API_URL + 'samplers').then(res => {
      setSamplers(res.data as Sampler[])
    }).catch(err => {
      console.error(err)
    });
  }, []);
  return (
    <div className="inline-block">
      <a
        onClick={() => setProcessParams({...p_params, request_model_setting: true })}
        className="p-1 inline-block cursor-pointer mb-3 rounded-lg dark:bg-slate-800 border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      >
        <svg
          className="inline-block w-4 h-4 mr-2 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
        </svg>
        <span className={`dark:text-white`}>Model Settings</span>
      </a>
      <Transition show={p_params.request_model_setting} as={Fragment} afterEnter={() => {}}>
        <Dialog onClose={() => setProcessParams({...p_params, request_model_setting: false })}>
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
            <div className="max-w-5xl mx-auto h-full flex items-center">
              <Dialog.Panel className="w-full rounded-3xl shadow-2xl bg-black">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    onClick={() => setProcessParams({...p_params, request_model_setting: false })}
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
                  <div className="p-6">
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Model settings
                    </h3>
                    <div>
                      <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="models"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Model
                          </label>
                          <select
                            id="models"
                            name="model"
                            value={params.model}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="">
                              Select a model
                            </option>
                            {
                              models.map((model, i) => <option key={i} value={model.title}>{model.model_name}</option>)
                            }
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="samplers"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Sampler
                          </label>
                          <select
                            id="samplers"
                            name="sampler_name"
                            value={params.sampler_name}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="">
                              Select a sampler
                            </option>
                            {
                              samplers.map((sampler, i) => <option key={i} value={sampler.name}>{sampler.name}</option>)
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                    <button
                      data-modal-hide="popup-modal"
                      onClick={() => setProcessParams({...p_params, request_model_setting: false })}
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      Close
                    </button>
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