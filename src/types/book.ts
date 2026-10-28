export const categories: string[] = [
  'Giáo trình',
  'Tiểu thuyết',
  'Khoa học',
  'Thiếu nhi',
];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  quantity: number;
  borrowed: number;
}

export type RootStackParamList = {
  Home: undefined;
  BookForm: { book?: Book } | undefined;
  BookDetail: { id: string };
};
