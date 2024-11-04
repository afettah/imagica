'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ImageIcon } from 'lucide-react';
import { generateImage } from './prediction.api';

export function ImageGeneratorComponent() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setImageUrl('');

    generateImage(prompt)
      .then((url) => {
        setImageUrl(url);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">AI Image Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter your image prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32"
              required
            />
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
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {imageUrl && (
            <div className="mt-4">
              <img src={imageUrl} alt="Generated image" className="max-w-full h-auto rounded-lg shadow-lg" />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
