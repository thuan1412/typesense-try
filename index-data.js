const typesense = require("typesense");
let client = new typesense.Client({
  nodes: [
    {
      host: "localhost", // For Typesense Cloud use xxx.a1.typesense.net
      port: "8108", // For Typesense Cloud use 443
      protocol: "http", // For Typesense Cloud use https
    },
  ],
  apiKey: "xyz",
  connectionTimeoutSeconds: 2,
});

const COLLECTION_NAME = "docs";
(async function () {
  // delete the `docs` collection if exist
  try {
    const collection = await client.collections(COLLECTION_NAME).retrieve();
    // console.log(`Drop the ${collection.name} successfully`);

    client.collections(COLLECTION_NAME).delete();
  } catch (err) {
    console.log(err.message);
  }

  // create document schema
  const schema = {
    name: COLLECTION_NAME,
    fields: [
      {
        name: "file_name", // for production, we may need to change to url to the docs
        type: "string",
        facet: false,
        index: false,
        optional: true,
      },
      {
        name: "section",
        type: "string",
        facet: false,
      },
      {
        name: "content",
        type: "string",
        facet: false,
      },
    ],
  };

  const collection = await client.collections().create(schema);
  // console.log(collection);

  // insert data
  let docs = [
    {
      id: "index.md",
      section: "hello",
      content: "loooooooooo",
    },
    {
      id: "index-2.md",
      section: "goodbye",
      content: "hel",
    },
  ];
  // console.log(COLLECTION_NAME);

  await client
    .collections(COLLECTION_NAME)
    .documents()
    .import(docs, { action: 'create' })

  const searchParams = {
    q: "hello",
    query_by: "section,content",
  };
  const result = await client
    .collections(COLLECTION_NAME)
    .documents()
    .search(searchParams);
  console.log(JSON.stringify(result.hits));
})();
