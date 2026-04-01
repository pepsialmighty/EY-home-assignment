export interface Person {
  id: number;
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  placeOfBirth: string | null;
}

export interface CreatePersonDto {
  name: string;
  dateOfBirth: string;
  placeOfBirth?: string;
}

export interface UpdatePersonDto {
  name: string;
  dateOfBirth: string;
  placeOfBirth?: string;
}
