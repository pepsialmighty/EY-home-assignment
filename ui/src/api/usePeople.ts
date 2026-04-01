import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPeople, createPerson, updatePerson, deletePerson } from './people';
import { PersonDto } from '../types/person';

export function usePeople() {
  return useQuery({ queryKey: ['people'], queryFn: fetchPeople });
}

export function useCreatePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: PersonDto) => createPerson(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['people'] }),
  });
}

export function useUpdatePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: PersonDto }) => updatePerson(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['people'] }),
  });
}

export function useDeletePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePerson(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['people'] }),
  });
}
