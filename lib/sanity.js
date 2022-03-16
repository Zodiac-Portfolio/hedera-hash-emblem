import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: "wullheah",
  dataset: "production",
  apiVersion: "v1",
  token:
    "skAL14wj311P7JYDcbYHtLHvqmo0ToC42Ca7gaGBZe0cmp5pFTWwITGrVgYZ4jXy6x66QZFOYOUCuf7RAPGJc7qmwOeu4fKCWwJ5SF8YzWdtFaQksUJO5s6vv4Z43U62nfb0dWMgUZ7hAMmm9FF77lKfTEo9ewafmPls63HgGnBnJB9guo3r",
  useCdn: false,
});
