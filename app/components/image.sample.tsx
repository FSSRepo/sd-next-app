import Image from "next/image";
import { useProcess } from "../models/process.provider";
import { useParameters } from "../models/parameter.provider";

export default function ImageSample() {
  let { p_params, setProcessParams } = useProcess();
  let { params } = useParameters();
  const handleImageClick = (index: number) => {
    setProcessParams({...p_params, current_image: index })
  };
  return (
    <div>
      {p_params.current_image < p_params.images.length ? (
        <Image
          className="h-auto"
          src={p_params.images[p_params.current_image]}
          alt="sample"
          width={300}
          height={200}
          priority
        />
      ) : (
        <p></p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-8 gap-4 p-3">
        { p_params.images.map((img, index) => (
          <Image
            className="h-auto max-w-full rounded-lg"
            onClick={() => { handleImageClick(index) }}
            key={index}
            src={img}
            alt="sample"
            width={300}
            height={200}
            priority
          />
        ))
        }
      </div>
      <p style={{whiteSpace: 'pre-line'}}>{ p_params.current_image < p_params.images.length && !p_params.running ? 'Image Information:\nPrompt: ' + params.prompt + '\nNegative prompt: '+ params.negative_prompt + '\nCFG Scale: '+params.cfg_scale + '\nSeed: '+p_params.seeds[p_params.current_image] : ''}</p>
      </div>
  );
}
