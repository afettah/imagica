import React, { useState } from 'react';
import { Form } from './form/Form';
import { GeneratedImage } from './GeneratedImage';
import { generateImage, PredictionRequest } from '../prediction.api';

export const ImageGenerator: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (request: PredictionRequest) => {
    setGeneratedImage('');
    setLoading(true);

    return generateImage(request).then((url) => {
      setLoading(false);
      setGeneratedImage(url);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto"></div>
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <div className="flex-1 p-6">
          <Form onSubmit={onSubmit} />
        </div>
        <div className="flex-1 p-6 space-y-6">
          <GeneratedImage imageUrl={generatedImage || undefined} loading={loading} />
        </div>
      </div>
    </div>
  );
};
