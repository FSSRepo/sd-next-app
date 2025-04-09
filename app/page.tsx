'use client'
import ParametersForm from './components/parameters.form';
import ParameterProvider from './models/parameter.provider';
import ProgressIndicator from './components/progress.indicator';
import ProcessProvider from './models/process.provider';
import ImageSample from './components/image.sample';

export default function Home() {
  return (
    <div className="grid grid-rows-1 grid-cols-2 grid-flow-col gap-4">
      <ParameterProvider>
        <ProcessProvider>
          <ParametersForm />
          <div className="col-span-2 ml-2 ">
            <ProgressIndicator />
            <ImageSample/>
          </div>
        </ProcessProvider>
      </ParameterProvider>
    </div>
  );
}
