<script lang="ts">
  import { page } from '$app/stores';
  import GenericList from '$lib/components/GenericList.svelte';
  import { Button } from "$lib/components/ui/button";

  interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    genre: string;
  }

  let books = $state<Book[]>($page.data.books);
  const headers = $page.data.headers;

  function handleBookClick(book: Book) {
    alert(`You clicked on "${book.title}" by ${book.author}`);
  }

  function addRandomBook() {
    const newBook: Book = {
      id: books.length + 1,
      title: `Random Book ${Math.floor(Math.random() * 1000)}`,
      author: `Author ${Math.floor(Math.random() * 100)}`,
      year: 1900 + Math.floor(Math.random() * 123),
      genre: ["Fiction", "Non-Fiction", "Science Fiction", "Mystery", "Romance"][Math.floor(Math.random() * 5)]
    };
    books = [...books, newBook];
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">{$page.data.title}</h1>
  
  <Button on:click={addRandomBook} class="mb-4">Add Random Book</Button>

  <GenericList
    data={books}
    headers={headers}
    onRowClick={handleBookClick}
  />
</div>
