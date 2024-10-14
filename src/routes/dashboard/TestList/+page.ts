import type { PageLoad } from './$types';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
}

interface Header {
  key: keyof Book;
  label: string;
  sortable: boolean;
}

export const load: PageLoad = async () => {
  const books: Book[] = [
    { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction" },
    { id: 2, title: "1984", author: "George Orwell", year: 1949, genre: "Science Fiction" },
    { id: 3, title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance" },
    { id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction" },
    { id: 5, title: "Moby-Dick", author: "Herman Melville", year: 1851, genre: "Adventure" },
  ];

  const headers: Header[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'author', label: 'Author', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'genre', label: 'Genre', sortable: true },
  ];

  return {
    title: 'Book List',
    books,
    headers
  };
};
