import { client } from "@/lib/client";

export default async function TestPage() {
  const response = await client.api.books.$get();

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return (
    <div>
      <h1>Test Page</h1>
      <p>Data fetched from external API:</p>
      <ul>
        {data.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
