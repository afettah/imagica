import React, { useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, ImageIcon, Loader2 } from 'lucide-react';
import { SettingsComponent } from './SettingsComponent';
import { ImagesInputComponent } from './ImagesInputComponent';
import { PredictionRequest } from '@/app/prediction.api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface FormValues {
  prompt: string;
  negativePrompt: string;
  service: string;
  model: string;
  width: number;
  height: number;
  uploadedImages: File[];
}

type FormProps = {
  onSubmit: (request: PredictionRequest) => Promise<void>;
};

export const Form = ({ onSubmit }: FormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const formMethods = useForm<FormValues>({
    defaultValues: {
      prompt: '',
      negativePrompt: '',
      service: 'replicate',
      model: 'SDXL',
      width: 512,
      height: 512,
      uploadedImages: [],
    },
  });
  const { register, handleSubmit } = formMethods;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const doHandleSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);
    setError('');
    onSubmit({
      prompt: data.prompt,
      service: data.service,
      negativePrompot: data.negativePrompt,
      model: data.model,
      width: data.width,
      height: data.height,
      images: data.uploadedImages,
    })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">AI Image Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(doHandleSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea id="prompt" {...register('prompt', { required: true })} placeholder="Enter your prompt here" />
            </div>
            <div>
              <Label htmlFor="negativePrompt">Negative Prompt</Label>
              <Textarea id="negativePrompt" {...register('negativePrompt')} placeholder="Enter negative prompt here" />
            </div>

            <ImagesInputComponent />

            <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  {isSettingsOpen ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                  {isSettingsOpen ? 'Hide Settings' : 'Show Settings'}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <SettingsComponent />
              </CollapsibleContent>
            </Collapsible>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col items-center">{error && <p className="text-red-500 mb-4">{error}</p>}</CardFooter>
    </Card>
  );
};
