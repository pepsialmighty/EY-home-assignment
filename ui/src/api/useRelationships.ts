import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchParents, createRelationship, deleteRelationship, fetchAllRelationships } from './relationships';
import type { ParentEntry, Relationship } from '../types/person';

export function useParents(personId: number) {
  return useQuery<ParentEntry[]>({
    queryKey: ['parents', personId],
    queryFn: () => fetchParents(personId),
  });
}

export function useRelationships() {
  return useQuery<Relationship[]>({
    queryKey: ['relationships'],
    queryFn: fetchAllRelationships,
  });
}

export function useCreateRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRelationship,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parents'] });
      qc.invalidateQueries({ queryKey: ['relationships'] });
      qc.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}

export function useDeleteRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteRelationship,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parents'] });
      qc.invalidateQueries({ queryKey: ['relationships'] });
      qc.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}
