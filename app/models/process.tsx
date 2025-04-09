import { Dispatch, SetStateAction } from "react"

export interface ProcessParams {
    running: boolean,
    progress: number,
    task_name: string,
    request_model_setting: boolean,
    current_image: number,
    seeds: number[];
    images: string[]
}

export type ProcessType = {
    p_params: ProcessParams,
    setProcessParams: Dispatch<SetStateAction<ProcessParams>>
}