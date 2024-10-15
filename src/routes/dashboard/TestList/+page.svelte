<script lang="ts">
	import { page } from '$app/stores'
	import GenericList from '$lib/components/GenericList.svelte'
	import { Button } from '$lib/components/ui/button'
	import Navbar from '$lib/components/Navbar.svelte'
	import Content from '$lib/components/Content.svelte'
	import StatusBar from '$lib/components/StatusBar.svelte'
	import { BookPlus } from 'lucide-svelte'
	import { faker } from '@faker-js/faker'

	interface Book {
		id: number
		title: string
		author: string
		year: number
		genre: string
	}

	let books = $state<Book[]>($page.data.books)
	const headers = $page.data.headers

	function handleBookClick(book: Book) {
		alert(`You clicked on "${book.title}" by ${book.author}`)
	}

	function capitalizeWord(word: string): string {
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}

	function generateBookTitle(): string {
		const patterns = [
			`The ${capitalizeWord(faker.word.adjective())} ${capitalizeWord(faker.word.noun())}`,
			`${capitalizeWord(faker.word.adjective())} ${capitalizeWord(faker.word.noun())}`,
			`${faker.person.firstName()}'s ${capitalizeWord(faker.word.noun())}`,
			`The ${capitalizeWord(faker.word.noun())} of ${capitalizeWord(faker.word.noun())}`,
			`${capitalizeWord(faker.word.verb())} the ${capitalizeWord(faker.word.noun())}`,
		];

		return faker.helpers.arrayElement(patterns);
	}

	function addRandomBook() {
		const newBook: Book = {
			id: books.length + 1,
			title: generateBookTitle(),
			author: faker.person.fullName(),
			year: faker.date.between({ from: '1900-01-01', to: '2023-12-31' }).getFullYear(),
			genre: faker.helpers.arrayElement([
				'Fiction',
				'Non-Fiction',
				'Science Fiction',
				'Mystery',
				'Romance',
				'Fantasy',
				'Thriller',
				'Biography',
				'History',
				'Poetry',
			]),
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

	<GenericList data={books} {headers} onRowClick={handleBookClick} />
	<!--</div>-->
</Content>
<StatusBar />
