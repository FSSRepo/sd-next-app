'use client'
import React, { useState } from "react";
import { GenerationParams } from "../models/gen_params";
import ModelSettings from "./model.settings";
import PromptManager from "./prompt.manager";
import { useParameters } from "../models/parameter.provider";
import { useProcess } from "../models/process.provider";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import API_URL from '../api';

const ParametersForm = () => {
  let { params, setParams } = useParameters();
  let { p_params, setProcessParams } = useProcess();
  let [ error, setError ] = useState("");

  const handleChange = (e: React.ChangeEvent<any>) => {
    const newParams: GenerationParams = { ...params, [e.target.name]: e.target.value };
    setParams(newParams);
  };

  const startProcess = async () => {
    setError("");
    if(!params.model || !params.sampler_name) {
      setProcessParams({ ...p_params, request_model_setting: true });
      toast.error('Select a valid model/sampler', {
        duration: 4000,
        position: 'bottom-left' });
      return;
    }
    if(params.model.toLowerCase().includes("xl")) {
      setError("SDXL Models not supported")
      return;
    }
    try {
      // check the current model to switch it if is needed
      const { sd_model_checkpoint } = (
        await axios.get(API_URL + "options")
      ).data as { sd_model_checkpoint: string };
      if(!sd_model_checkpoint.startsWith(params.model)) {
        await axios.post(API_URL + "options", { sd_model_checkpoint: params.model });
      }
      setProcessParams({ ...p_params, task_name: 'Loading model', running: true });
      await axios.post(API_URL + "reload-checkpoint", {});
      // generate image
      let loopId = setInterval(async () => {
        let { progress, current_image, state } = (await axios.get(API_URL + "progress")).data;
        setProcessParams({
          running: true,
          task_name: 'Generating image - '+(state.job_no + 1)+" of "+state.job_count + " - Sampling "+((state.sampling_step / state.sampling_steps)*100.0).toFixed(2)+"%",
          current_image: 0,
          request_model_setting: false,
          images: ['data:image/png;base64,' + current_image],
          progress: Math.round(progress * 100.0),
          seeds: []
        });
      }, 400);
      let result = ((await axios.post(API_URL + "txt2img", params)).data) as { images: string[], info: string };
      let images = result.images.map(im =>'data:image/png;base64,' + im);
      let { all_seeds } = JSON.parse(result.info);
      setProcessParams({
        ...p_params,
        current_image: 0,
        images,
        running: false,
        seeds: all_seeds,
      });
      clearInterval(loopId);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="col-span-1">
      <ModelSettings />
      <PromptManager />
      <div className="mb-2">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Prompt
        </label>
        <textarea
          id="message"
          name="prompt"
          rows={2}
          onChange={handleChange}
          value={params.prompt}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        ></textarea>
      </div>
      <div className="mb-2">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Negative Prompt
        </label>
        <textarea
          id="message"
          rows={2}
          name="negative_prompt"
          onChange={handleChange}
          value={params.negative_prompt}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        ></textarea>
      </div>
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        {/* Width */}
        <div>
          <label
            htmlFor="width"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Width
          </label>
          <input
            type="number"
            id="width"
            name="width"
            onChange={handleChange}
            value={params.width}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        {/* Height */}
        <div>
          <label
            htmlFor="height"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Height
          </label>
          <input
            type="number"
            id="height"
            name="height"
            onChange={handleChange}
            value={params.height}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        {/* Iterations */}
        <div>
          <label
            htmlFor="steps"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Iterations
          </label>
          <input
            type="number"
            id="steps"
            name="steps"
            onChange={handleChange}
            value={params.steps}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        {/* Seed */}
        <div>
          <label
            htmlFor="height"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Seed
          </label>
          <input
            type="number"
            id="height"
            name="seed"
            onChange={handleChange}
            value={params.seed}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        {/* CFG Scale */}
        <div>
          <label
            htmlFor="cfg_scale"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            CFG Scale
          </label>
          <input
            type="number"
            id="cfg_scale"
            name="cfg_scale"
            onChange={handleChange}
            value={params.cfg_scale}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        {/* Batch Count */}
        <div>
          <label
            htmlFor="batch_num"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Batch Count
          </label>
          <input
            type="number"
            id="batch_num"
            name="n_iter"
            onChange={handleChange}
            value={params.n_iter}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="mb-32 grid text-center lg:max-w-4xl lg:w-full lg:mb-0 lg:text-left">
        <a
          href="#"
          onClick={startProcess}
          className="group rounded-lg dark:bg-slate-800 border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2
            className={
              `mb-3 text-2xl font-semibold dark:text-white ` +
              (error ? " text-red-600" : "")
            }
          >
            Generate{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1  motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p
            className={
              `m-0 max-w-[30ch] dark:text-slate-400 text-sm opacity-80 ` +
              (error ? " text-red-500" : "")
            }
          >
            {!error ? "Load model" : error}
          </p>
        </a>
      </div>
      <Toaster/>
    </div>
  );
};

export default ParametersForm;
