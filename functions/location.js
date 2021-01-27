const faunadb = require("faunadb");

const { Paginate, Match, Index, ToString } = faunadb.query;

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

const locationKeys = [
  "tst",
  "acc",
  "alt",
  "batt",
  "bs",
  "cog",
  "lat",
  "lon",
  "rad",
  "t",
  "tid",
  "vac",
  "vel",
  "p",
  "conn",
  "inregions",
  "SSID",
  "BSSID",
];
const parseFaunaLocationValues = (locationValues) => {
  const location = {};
  locationValues.forEach((locationValue, index) => {
    const locationKey = locationKeys[index];
    location[locationKey] = locationValue;
  });
  return location;
};

const GetLatestLocationByTid = (tid) =>
  Paginate(Match(Index("locations_by_tid"), tid), { size: 1 });

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
    // this will throw an error to our catch if there is no data in the response
    const location = parseFaunaLocationValues(response.data[0]);
    return {
      statusCode: 200,
      body: JSON.stringify(location),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
