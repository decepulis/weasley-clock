const faunadb = require("faunadb");

const { Create, Collection, Epoch } = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = async (event, context) => {
  data = JSON.parse(event.body);

  if (event.headers.authorization !== process.env.API_PASSWORD) {
    return {
      statusCode: 403,
    };
  }

  // We convert the provided timestamp
  // into a FaunaDB Time() object
  if (typeof data.tst === "number") {
    data.tst = Epoch(data.tst, "seconds");
  }

  // Then, we post
  try {
    response = await client.query(Create(Collection("owntracks"), { data }));
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
