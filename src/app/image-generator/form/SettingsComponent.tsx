import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useWatch, useFormContext } from 'react-hook-form';
import { SERVICES } from './services';
import { MODELS } from './models';

export const SettingsComponent = () => {
  const { control, register, setValue } = useFormContext();
  const selectedService = useWatch({ control, name: 'service' });
  const selectedModel = useWatch({ control, name: 'model' });
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="service">Service</Label>
        <Select value={selectedService} onValueChange={(value) => setValue('service', value)}>
          <SelectTrigger id="service">
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(SERVICES).map((serviceOption) => (
              <SelectItem key={serviceOption} value={serviceOption}>
                {serviceOption.charAt(0).toUpperCase() + serviceOption.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedService !== SERVICES.MOCK && (
        <>
          <div>
            <Label htmlFor="model">Model</Label>
            <Select
              value={selectedModel}
              onValueChange={(value) => setValue('model', value)} // Update form value manually
            >
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MODELS).map((model) => (
                  <SelectItem key={model} value={model}>
                    {model.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="width">Width</Label>
            <Input id="width" type="number" {...register('width', { valueAsNumber: true })} />
          </div>
          <div>
            <Label htmlFor="height">Height</Label>
            <Input id="height" type="number" {...register('height', { valueAsNumber: true })} />
          </div>
        </>
      )}
    </div>
  );
};
