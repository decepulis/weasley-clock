const faunadb = require("faunadb");

const { Create, Collection, Epoch } = faunadb.query;

const authStringContainsCorrectPassword = (authString) => {
  if (
    typeof authString === "undefined" ||
    typeof authString.replace !== "function"
  ) {
    return false;
  }

  const cleanAuthString = authString.replace("Basic", "").trim();
  const parsedAuthString = Buffer.from(cleanAuthString, "base64").toString();
  const splitAuthString = parsedAuthString.split(":");
  const passwordFromAuthString = splitAuthString[splitAuthString.length - 1];

  if (passwordFromAuthString !== process.env.API_PASSWORD) {
    return false;
  }

  return true;
};

exports.handler = async (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET,
  });

  // Before starting,
  // let's check to see if we're authed with the right password
  const authString = event.headers.authorization;
  if (!authStringContainsCorrectPassword(authString)) {
    return {
      statusCode: 403,
    };
  }

  const data = JSON.parse(event.body);

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
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
