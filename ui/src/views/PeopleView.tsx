import { useState } from "react";
import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Person, PersonDto } from "../types/person";
import { usePeople, useUpdatePerson, useDeletePerson } from "../api/usePeople";
import {
  useRelationships,
  useDeleteRelationship,
} from "../api/useRelationships";
import { useToast } from "../context/ToastContext";

function computeAge(dateOfBirth: string): number {
  return Math.floor(
    (Date.now() - new Date(dateOfBirth).getTime()) /
      (365.25 * 24 * 3600 * 1000),
  );
}

export function PeopleView() {
  const { data: people = [], isLoading, error } = usePeople();
  const { data: relationships = [] } = useRelationships();
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();
  const deleteRelationship = useDeleteRelationship();
  const { showToast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<PersonDto>({
    name: "",
    dateOfBirth: "",
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editSubmitted, setEditSubmitted] = useState(false);
  const [editApiError, setEditApiError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [removingRelId, setRemovingRelId] = useState<number | null>(null);

  function parentsOf(personId: number): Person[] {
    return relationships
      .filter((r) => r.childId === personId)
      .map((r) => people.find((p) => p.id === r.parentId))
      .filter((p): p is Person => p !== undefined);
  }

  function childrenOf(
    personId: number,
  ): Array<{ relationshipId: number; person: Person }> {
    return relationships
      .filter((r) => r.parentId === personId)
      .map((r) => ({
        relationshipId: r.id,
        person: people.find((p) => p.id === r.childId),
      }))
      .filter(
        (e): e is { relationshipId: number; person: Person } =>
          e.person !== undefined,
      );
  }

  function startEdit(person: Person) {
    setEditingId(person.id);
    setEditValues({
      name: person.name,
      dateOfBirth: person.dateOfBirth,
      placeOfBirth: person.placeOfBirth ?? undefined,
    });
    setEditErrors({});
    setEditSubmitted(false);
    setEditApiError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditErrors({});
    setEditApiError("");
  }

  function handleEditSave(id: number) {
    setEditSubmitted(true);
    const errs: Record<string, string> = {};
    if (!editValues.name.trim()) errs.name = "Name is required";
    if (!editValues.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;
    updatePerson.mutate(
      { id, dto: { ...editValues, name: editValues.name.trim() } },
      {
        onSuccess: () => {
          setEditingId(null);
          showToast("Person updated successfully");
        },
        onError: (err) =>
          setEditApiError(
            err instanceof Error ? err.message : "Failed to update",
          ),
      },
    );
  }

  function confirmDelete(id: number) {
    deletePerson.mutate(id, {
      onSuccess: () => {
        setDeletingId(null);
        showToast("Person deleted");
      },
    });
  }

  function confirmRemoveRel(relId: number) {
    deleteRelationship.mutate(relId, {
      onSuccess: () => {
        setRemovingRelId(null);
        showToast("Relationship removed");
      },
    });
  }

  if (isLoading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">Failed to load people.</div>;

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-gray-500">
        <p className="mb-4">No people yet — click Add Person to get started</p>
        <Link
          to="/add-person"
          className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Add Person
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1 rounded-xl border border-gray-200 p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all">
          <div className="text-3xl font-bold text-gray-900">
            {people.length}
          </div>
          <div className="text-sm text-gray-500">People</div>
        </div>
        <div className="flex-1 rounded-xl border border-gray-200 p-4 text-center hover:border-gray-300 hover:shadow-sm transition-all">
          <div className="text-3xl font-bold text-gray-900">
            {relationships.length}
          </div>
          <div className="text-sm text-gray-500">Relationships</div>
        </div>
      </div>

      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Family Tree ({people.length} people, {relationships.length}{" "}
        relationships)
      </h2>

      <ul data-testid="people-list" className="space-y-3">
        {people.map((person) => {
          const parents = parentsOf(person.id);
          const children = childrenOf(person.id);
          const age = computeAge(person.dateOfBirth);
          const isEditing = editingId === person.id;
          const isDeleting = deletingId === person.id;

          return (
            <li
              key={person.id}
              data-testid={`person-row-${person.id}`}
              className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow transition-shadow"
            >
              {isDeleting ? (
                <div className="text-sm text-gray-700">
                  Are you sure you want to delete <strong>{person.name}</strong>
                  ?
                  <button
                    data-testid={`btn-delete-confirm-${person.id}`}
                    onClick={() => confirmDelete(person.id)}
                    className="text-red-600 font-medium ml-3 hover:text-red-800"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="text-gray-500 ml-2 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : isEditing ? (
                <div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Name *
                    </label>
                    <input
                      data-testid="input-name"
                      type="text"
                      value={editValues.name}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, name: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-colors"
                    />
                    {editSubmitted && editErrors.name && (
                      <span
                        data-testid="field-error-name"
                        className="text-red-500 text-xs mt-1 block"
                      >
                        {editErrors.name}
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      data-testid="input-dob"
                      type="date"
                      value={editValues.dateOfBirth}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          dateOfBirth: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-colors"
                    />
                    {editSubmitted && editErrors.dateOfBirth && (
                      <span
                        data-testid="field-error-dateOfBirth"
                        className="text-red-500 text-xs mt-1 block"
                      >
                        {editErrors.dateOfBirth}
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Place of Birth
                    </label>
                    <input
                      data-testid="input-place-of-birth"
                      type="text"
                      value={editValues.placeOfBirth ?? ""}
                      onChange={(e) =>
                        setEditValues((v) => ({
                          ...v,
                          placeOfBirth: e.target.value || undefined,
                        }))
                      }
                      placeholder="Place of birth (optional)"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-colors"
                    />
                  </div>
                  {editApiError && (
                    <div
                      data-testid="api-error"
                      className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-2 mb-3"
                    >
                      {editApiError}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      data-testid="btn-submit"
                      onClick={() => handleEditSave(person.id)}
                      disabled={updatePerson.isPending}
                      className="bg-gray-900 text-white rounded-xl px-4 py-1.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors"
                    >
                      {updatePerson.isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-100 text-gray-900 rounded-xl px-4 py-1.5 text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center flex-wrap gap-1">
                      <span className="font-semibold text-gray-900">
                        {person.name}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                        {age} years old
                      </span>
                      {person.placeOfBirth && (
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                          {person.placeOfBirth}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <button
                        data-testid={`btn-edit-${person.id}`}
                        onClick={() => startEdit(person)}
                        className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Edit"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        data-testid={`btn-delete-${person.id}`}
                        onClick={() => setDeletingId(person.id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {parents.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Parents: {parents.map((p) => p.name).join(", ")}
                    </p>
                  )}

                  {children.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {children.map((child) => (
                          <span
                            key={child.relationshipId}
                            className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 hover:bg-blue-100"
                          >
                            {child.person.name}
                            <button
                              onClick={() =>
                                setRemovingRelId(child.relationshipId)
                              }
                              className="hover:text-blue-900 font-medium"
                              aria-label={`Remove ${child.person.name} as child`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      {children.map((child) =>
                        removingRelId === child.relationshipId ? (
                          <div
                            key={child.relationshipId}
                            className="mt-2 text-sm text-gray-700"
                          >
                            Remove <strong>{child.person.name}</strong> as a
                            child?
                            <button
                              onClick={() =>
                                confirmRemoveRel(child.relationshipId)
                              }
                              className="text-red-600 font-medium ml-2 hover:text-red-800"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setRemovingRelId(null)}
                              className="text-gray-500 ml-2 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : null,
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
