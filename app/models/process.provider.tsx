import { createContext, useContext, useState } from "react"
import { ProcessParams, ProcessType } from "./process";

const ProcessContext = createContext<ProcessType | null>(null);

interface Props {
    children: React.ReactNode;
}

export function useProcess() {
    return useContext(ProcessContext) as ProcessType;
}

const ProcessProvider: React.FC<Props> = ({ children }) => {
    let [p_params, setProcessParams] = useState<ProcessParams>({
        running: false,
        progress: 0,
        task_name: '',
        request_model_setting: false,
        current_image: 0,
        seeds: [],
        images: []
      });
    
    return (
        <ProcessContext.Provider value={{ p_params, setProcessParams }}>
            {children}
        </ProcessContext.Provider>
    )
}

export default ProcessProvider;