<script lang="ts">
  import { page } from '$app/stores';
  import GenericList from '$lib/components/GenericList.svelte';
  import { Button } from "$lib/components/ui/button";
	import Navbar from '$lib/components/Navbar.svelte';
	import Content from '$lib/components/Content.svelte';
	import StatusBar from '$lib/components/StatusBar.svelte';
	import { 
    BookPlus
  } from 'lucide-svelte';

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
<Navbar>
	<div slot="title">Book List</div>
	<div slot="top-right" class="flex items-center space-x-2">
		<Button onclick={addRandomBook} variant="ghost" size="icon">
			<BookPlus class="h-5 w-5" />
			<span class="sr-only">New Book</span>
		</Button>
	</div>

</Navbar>
<Content>
<!--<div class="mx-auto pt-4 pb-4">-->
  
  <GenericList
    data={books}
    headers={headers}
    onRowClick={handleBookClick}
  />
<!--</div>-->
</Content>
<StatusBar />