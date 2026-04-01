import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchParents, createRelationship, deleteRelationship } from './relationships';
import type { ParentEntry } from '../types/person';

export function useParents(personId: number) {
  return useQuery<ParentEntry[]>({
    queryKey: ['parents', personId],
    queryFn: () => fetchParents(personId),
  });
}

export function useCreateRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRelationship,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['parents'] }),
  });
}

export function useDeleteRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteRelationship,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['parents'] }),
  });
}
