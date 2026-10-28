import { Book } from "./types/book";

export const initBooks: Book[] = [
  {
    id: '1',
    title: 'Lập trình ngôn ngữ đa nền tảng',
    author: 'Trần Quang Đại',
    category: 'Giáo trình',
    year: 2023,
    quantity: 5,
    borrowed: 2,
  },
  {
    id: '2',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 2020,
    quantity: 3,
    borrowed: 3,
  },
  {
    id: '3',
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    category: 'Tiểu thuyết',
    year: 2019,
    quantity: 4,
    borrowed: 0,
  },
  {
    id: '4',
    title: 'Lược Sử Thời Gian',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2021,
    quantity: 6,
    borrowed: 1,
  },
  {
    id: '5',
    title: 'Cấu trúc dữ liệu và giải thuật',
    author: 'Trần Minh Tuấn',
    category: 'Giáo trình',
    year: 2022,
    quantity: 8,
    borrowed: 0,
  },
];