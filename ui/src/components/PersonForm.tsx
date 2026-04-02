import { useState } from 'react';
import type { FormEvent } from 'react';
import type { PersonDto } from '../types/person';

interface PersonFormProps {
  onSubmit: (dto: PersonDto) => void;
  defaultValues?: PersonDto;
  submitLabel: string;
  apiError?: string;
  isSubmitting?: boolean;
}

export function PersonForm({ onSubmit, defaultValues, submitLabel, apiError, isSubmitting }: PersonFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(defaultValues?.dateOfBirth ?? '');
  const [placeOfBirth, setPlaceOfBirth] = useState(defaultValues?.placeOfBirth ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    return errs;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      name: name.trim(),
      dateOfBirth,
      placeOfBirth: placeOfBirth.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} data-testid="person-form">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter full name"
          data-testid="input-name"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-colors"
        />
        {submitted && errors.name && (
          <span data-testid="field-error-name" className="text-red-500 text-xs mt-1 block">
            {errors.name}
          </span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth *
        </label>
        <input
          id="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          data-testid="input-dob"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-colors"
        />
        {submitted && errors.dateOfBirth && (
          <span data-testid="field-error-dateOfBirth" className="text-red-500 text-xs mt-1 block">
            {errors.dateOfBirth}
          </span>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
          Place of Birth
        </label>
        <input
          id="placeOfBirth"
          type="text"
          value={placeOfBirth}
          onChange={(e) => setPlaceOfBirth(e.target.value)}
          placeholder="e.g., New York, USA"
          data-testid="input-place-of-birth"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-colors"
        />
      </div>

      {apiError && (
        <div
          data-testid="api-error"
          className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4"
        >
          {apiError}
        </div>
      )}

      <button
        type="submit"
        data-testid="btn-submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
