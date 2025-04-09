export interface GenerationParams {
    prompt: string;
    negative_prompt: string;
    sampler_name: string;
    model: string;
    cfg_scale: number;
    width: number;
    height: number;
    seed: number;
    steps: number;
    n_iter: number;
}

export type ParamsContextType = {
    params: GenerationParams,
    setParams: (prms: GenerationParams) => void
}