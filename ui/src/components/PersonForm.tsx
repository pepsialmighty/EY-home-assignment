import { useState, FormEvent } from 'react';
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
      <div>
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="input-name"
        />
        {submitted && errors.name && (
          <span data-testid="field-error-name" style={{ color: 'red' }}>{errors.name}</span>
        )}
      </div>

      <div>
        <label htmlFor="dateOfBirth">Date of Birth *</label>
        <input
          id="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          data-testid="input-dob"
        />
        {submitted && errors.dateOfBirth && (
          <span data-testid="field-error-dateOfBirth" style={{ color: 'red' }}>{errors.dateOfBirth}</span>
        )}
      </div>

      <div>
        <label htmlFor="placeOfBirth">Place of Birth</label>
        <input
          id="placeOfBirth"
          type="text"
          value={placeOfBirth}
          onChange={(e) => setPlaceOfBirth(e.target.value)}
          data-testid="input-place-of-birth"
        />
      </div>

      {apiError && (
        <div data-testid="api-error" style={{ color: 'red' }}>{apiError}</div>
      )}

      <button type="submit" data-testid="btn-submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
