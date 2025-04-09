import { useProcess } from "../models/process.provider"

export default function ProgressIndicator() {
    let { p_params } = useProcess();
    return (
      <div className={p_params.running ? "" : "hidden"}>
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-blue-700 dark:text-white">
            {p_params.task_name}
          </span>
          <span className="text-sm font-medium text-blue-700 dark:text-white">
            {p_params.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-1">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: p_params.progress + "%" }}
          ></div>
        </div>
      </div>
    );
}