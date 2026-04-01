export interface Person {
  id: number;
  name: string;
  dateOfBirth: string;
  placeOfBirth: string | null;
}

export interface PersonDto {
  name: string;
  dateOfBirth: string;
  placeOfBirth?: string;
}
