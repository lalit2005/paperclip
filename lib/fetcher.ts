export default async function fetcher(url) {
  const response = await fetch(url);
  return response.json();
}
