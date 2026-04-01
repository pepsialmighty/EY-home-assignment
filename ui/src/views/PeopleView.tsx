import { useState } from 'react';
import { Person } from '../types/person';
import { PersonForm } from '../components/PersonForm';
import { usePeople, useCreatePerson, useUpdatePerson, useDeletePerson } from '../api/usePeople';

export function PeopleView() {
  const { data: people, isLoading, error } = usePeople();
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load people.</div>;

  return (
    <div>
      <h2>People</h2>

      <button data-testid="btn-add-person" onClick={() => { setShowAddForm(true); setEditingPerson(null); }}>
        Add Person
      </button>

      {showAddForm && !editingPerson && (
        <PersonForm
          submitLabel="Add"
          isSubmitting={createPerson.isPending}
          apiError={createPerson.error?.message}
          onSubmit={(dto) => {
            createPerson.mutate(dto, { onSuccess: () => setShowAddForm(false) });
          }}
        />
      )}

      <ul data-testid="people-list" style={{ listStyle: 'none', padding: 0 }}>
        {people?.map((person) => (
          <li key={person.id} data-testid={`person-row-${person.id}`} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
            {editingPerson?.id === person.id ? (
              <PersonForm
                submitLabel="Save"
                defaultValues={{ name: person.name, dateOfBirth: person.dateOfBirth, placeOfBirth: person.placeOfBirth ?? undefined }}
                isSubmitting={updatePerson.isPending}
                apiError={updatePerson.error?.message}
                onSubmit={(dto) => {
                  updatePerson.mutate({ id: person.id, dto }, { onSuccess: () => setEditingPerson(null) });
                }}
              />
            ) : (
              <div>
                <strong>{person.name}</strong> — {person.dateOfBirth}
                {person.placeOfBirth && <span> — {person.placeOfBirth}</span>}
                <button
                  data-testid={`btn-edit-${person.id}`}
                  onClick={() => { setEditingPerson(person); setShowAddForm(false); }}
                  style={{ marginLeft: '1rem' }}
                >
                  Edit
                </button>
                <button
                  data-testid={`btn-delete-${person.id}`}
                  onClick={() => {
                    if (confirm(`Delete ${person.name}?`)) {
                      deletePerson.mutate(person.id);
                    }
                  }}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
