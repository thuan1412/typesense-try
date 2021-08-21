const typesense = require("typesense");

const mdParser = require("./md-parser");
const { getMdFileList } = require("./utils");

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
    await client.collections(COLLECTION_NAME).retrieve();

    client.collections(COLLECTION_NAME).delete();
  } catch (err) {
    console.log(err.message);
  }

  // create document schema
  const schema = {
    name: COLLECTION_NAME,
    fields: [
      {
        name: "section_idx", // for production, we may need to change to url to the docs
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

  await client.collections().create(schema);

  // insert data
  const fileList = [];
  await getMdFileList("./v2/", fileList);

  for (let i = 0; i < fileList.length; i++) {
    const filename = fileList[i];
    const data = await mdParser(filename);
    console.log(filename);
    if (data.length === 0) continue;
    try {
      await client
        .collections(COLLECTION_NAME)
        .documents()
        .import(data, { action: "create" });
    } catch (err) {
      console.log("error at file", filename, err, data);
    }
  }

  const searchParams = {
    q: "thực hiện ràng buộc",
    query_by: "section,content",
  };
  const result = await client
    .collections(COLLECTION_NAME)
    .documents()
    .search(searchParams);
  console.log(
    // JSON.stringify(
    result.hits.map((doc) => {
      return doc.highlights;
    })
    // )
  );
  // console.log(result.hits.);
})();
