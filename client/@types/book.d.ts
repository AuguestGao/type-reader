export interface IBook {
  id: string;
  title: string;
  body?: string;
  author: string;
  userId: string;
}

export interface IFormField {
  type?: string;
  label: string;
  id: string;
  value: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}
