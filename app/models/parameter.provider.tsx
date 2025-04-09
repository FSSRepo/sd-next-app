import { createContext, useContext, useEffect, useState } from "react";
import { GenerationParams, ParamsContextType } from "./gen_params";

const ParameterContext = createContext<ParamsContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export function useParameters() {
    return useContext(ParameterContext) as ParamsContextType;
}

const ParameterProvider: React.FC<Props> = ({ children }) => {
    let [params, setParams] = useState<GenerationParams>({
        prompt: "",
        negative_prompt: "",
        width: 512,
        height: 512,
        seed: -1,
        sampler_name: "",
        cfg_scale: 7.0,
        steps: 20,
        n_iter: 1,
        model: "",
      });

      useEffect(() => {
        let saved_data = localStorage.getItem("generator_params");
        if(saved_data) {
            setParams(JSON.parse(saved_data))
        }
      }, [])
      
      useEffect(() => {
        localStorage.setItem(
          "generator_params",
          JSON.stringify(params)
        );
      }, [params]);
    
    return (
        <ParameterContext.Provider value={{params, setParams}}>
            {children}
        </ParameterContext.Provider>
    )
}

export default ParameterProvider;