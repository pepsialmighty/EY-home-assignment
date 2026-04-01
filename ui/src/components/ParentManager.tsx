import { useState } from 'react';
import type { Person } from '../types/person';
import { useParents, useCreateRelationship, useDeleteRelationship } from '../api/useRelationships';

interface ParentManagerProps {
  person: Person;
  allPeople: Person[];
}

export function ParentManager({ person, allPeople }: ParentManagerProps) {
  const { data: parentEntries = [], isLoading } = useParents(person.id);
  const createRelationship = useCreateRelationship();
  const deleteRelationship = useDeleteRelationship();
  const [selectedParentId, setSelectedParentId] = useState('');
  const [addError, setAddError] = useState('');

  const parentIds = new Set(parentEntries.map((e) => e.person.id));
  const eligible = allPeople.filter((p) => p.id !== person.id && !parentIds.has(p.id));

  function handleAdd() {
    if (!selectedParentId) return;
    setAddError('');
    createRelationship.mutate(
      { parentId: parseInt(selectedParentId, 10), childId: person.id },
      {
        onSuccess: () => setSelectedParentId(''),
        onError: (err) => setAddError(err instanceof Error ? err.message : 'Failed to add parent'),
      }
    );
  }

  function handleRemove(relationshipId: number) {
    deleteRelationship.mutate(relationshipId);
  }

  if (isLoading) return <span>Loading parents...</span>;

  return (
    <div data-testid={`parent-manager-${person.id}`} style={{ marginTop: '0.5rem' }}>
      <strong>Parents:</strong>
      {parentEntries.length === 0 && <span style={{ marginLeft: '0.5rem', color: '#888' }}>None</span>}
      <ul style={{ margin: '0.25rem 0', paddingLeft: '1.25rem' }}>
        {parentEntries.map(({ relationshipId, person: parent }) => (
          <li key={relationshipId} data-testid={`parent-entry-${parent.id}`}>
            {parent.name} ({parent.dateOfBirth})
            <button
              data-testid={`btn-remove-parent-${parent.id}`}
              onClick={() => handleRemove(relationshipId)}
              style={{ marginLeft: '0.5rem' }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {parentEntries.length < 2 && eligible.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
          <select
            data-testid={`select-parent-${person.id}`}
            value={selectedParentId}
            onChange={(e) => setSelectedParentId(e.target.value)}
          >
            <option value="">— select parent —</option>
            {eligible.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.dateOfBirth})
              </option>
            ))}
          </select>
          <button
            data-testid={`btn-add-parent-${person.id}`}
            onClick={handleAdd}
            disabled={createRelationship.isPending}
          >
            Add Parent
          </button>
        </div>
      )}

      {addError && (
        <div data-testid={`parent-error-${person.id}`} style={{ color: 'red', marginTop: '0.25rem' }}>
          {addError}
        </div>
      )}
    </div>
  );
}
