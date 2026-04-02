import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePeople } from '../api/usePeople';
import { useRelationships, useCreateRelationship } from '../api/useRelationships';
import { useToast } from '../context/ToastContext';

export function AddRelationshipView() {
  const navigate = useNavigate();
  const { data: people = [] } = usePeople();
  const { data: relationships = [] } = useRelationships();
  const createRelationship = useCreateRelationship();
  const { showToast } = useToast();

  const [parentId, setParentId] = useState('');
  const [childId, setChildId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  function parentCountOf(id: number): number {
    return relationships.filter((r) => r.childId === id).length;
  }

  const eligibleChildren = people.filter((p) => parentCountOf(p.id) < 2);

  function handleSubmit() {
    setSubmitted(true);
    if (!parentId || !childId) return;
    setApiError('');
    createRelationship.mutate(
      { parentId: parseInt(parentId, 10), childId: parseInt(childId, 10) },
      {
        onSuccess: () => {
          showToast('Relationship added successfully');
          navigate('/');
        },
        onError: (err) => setApiError(err instanceof Error ? err.message : 'Failed to add relationship'),
      }
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Add Parent-Child Relationship</h2>
      <p className="text-sm text-gray-500 mb-6">
        Select a parent and child to create a family relationship. Parents must be at least 15 years
        older than their children.
      </p>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <label htmlFor="select-parent" className="block text-sm font-medium text-gray-700 mb-1">Parent *</label>
          <select
            id="select-parent"
            data-testid="select-parent"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 cursor-pointer transition-colors"
          >
            <option value="">Select parent...</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {submitted && !parentId && (
            <span className="text-red-500 text-xs mt-1 block">Parent is required</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="select-child" className="block text-sm font-medium text-gray-700 mb-1">Child *</label>
          <select
            id="select-child"
            data-testid="select-child"
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 cursor-pointer transition-colors"
          >
            <option value="">Select child...</option>
            {eligibleChildren.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {submitted && !childId && (
            <span className="text-red-500 text-xs mt-1 block">Child is required</span>
          )}
          <p className="text-xs text-gray-400 mt-1">People with 2 parents are not shown in the list</p>
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
          data-testid="btn-submit"
          onClick={handleSubmit}
          disabled={createRelationship.isPending}
          className="w-full bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors"
        >
          {createRelationship.isPending ? 'Saving...' : 'Add Relationship'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-100 text-gray-900 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-200 mt-3 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
