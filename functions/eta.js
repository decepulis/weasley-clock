const { Client } = require("@googlemaps/google-maps-services-js");
const { createImportSpecifier } = require("typescript");

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

const client = new Client({});

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

  // Aight let's get some ETA!
  const { lat, lng } = event.queryStringParameters;
  if (typeof lat === "undefined" || typeof lng === "undefined") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Query String Parameters "lat" and "lng" are required',
      }),
    };
  }

  try {
    const { GMAPS_SECRET, HOME_LAT, HOME_LNG } = process.env;
    const response = await client.directions({
      params: {
        origin: `${lat},${lng}`,
        destination: `${HOME_LAT},${HOME_LNG}`,
        mode: "driving", // TODO: implement transit
        key: GMAPS_SECRET,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
