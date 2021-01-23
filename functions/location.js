const faunadb = require("faunadb");

const {
  Map: FaunaMap,
  Paginate,
  Join,
  Intersection,
  Match,
  Index,
  Lambda,
  Get,
  Var,
} = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

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

const GetLatestLocationByTid = (tid) =>
  FaunaMap(
    Paginate(
      Join(
        Intersection(
          Match(Index("all_tracks_by_type"), "location"),
          Match(Index("all_tracks_by_tid"), tid)
        ),
        Index("track_sort_by_timestamp_desc")
      ),
      { size: 1 }
    ),
    Lambda(["trackTime", "trackRef"], Get(Var("trackRef")))
  );
exports.handler = async (event, context) => {
  // Before starting,
  // let's check to see if we're authed with the right password
  const authString = event.headers.authorization;
  if (!authStringContainsCorrectPassword(authString)) {
    return {
      statusCode: 403,
      body: JSON.stringify("Incorrect Password"),
    };
  }

  // Alright now let's do a request!
  const { tid } = event.queryStringParameters;
  if (typeof tid === "undefined") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Query String Parameter "tid" is required',
      }),
    };
  }

  try {
    response = await client.query(GetLatestLocationByTid(tid));
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
