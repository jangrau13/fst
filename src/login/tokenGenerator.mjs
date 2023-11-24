import { createDpopHeader, generateDpopKeyPair } from '@inrupt/solid-client-authn-core';
import { faker } from '@faker-js/faker';
import fetch from 'cross-fetch';



export const getSecret = async () => {

  const response0 = await fetch('https://solid.interactions.ics.unisg.ch/idp/credentials/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // The email/password fields are those of your account.
    // The name field will be used when generating the ID of your token.
      //body: JSON.stringify({ email: 'lars@laufen.de', password: 'cssPod1', name: name }),
      body: JSON.stringify({ email: 'ucJan@pod.com', password: 'cssPod1', name: 'token69' }),
  });

  // These are the identifier and secret of your token.
  // Store the secret somewhere safe as there is no way to request it again from the server!
  const { id, secret } = await response0.json();
  console.log("--This is id", id, "This is secret: ", secret);

  return [id,secret];
}

export const getToken = async (id, secret) => {

  // A key pair is needed for encryption.
  // This function from `solid-client-authn` generates such a pair for you.
  const dpopKey = await generateDpopKeyPair();

  // These are the ID and secret generated in the previous step.
  // Both the ID and the secret need to be form-encoded.
  const authString = `${encodeURIComponent(id)}:${encodeURIComponent(secret)}`;

  // This URL can be found by looking at the "token_endpoint" field at
  const tokenUrl = 'https://solid.interactions.ics.unisg.ch/.oidc/token';
 
  const timestamp = new Date();
  console.log("--This is timestamp: ", timestamp)

  const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
          // The header needs to be in base64 encoding.
          authorization: `Basic ${Buffer.from(authString).toString('base64')}`,
          'content-type': 'application/x-www-form-urlencoded',
          dpop: await createDpopHeader(tokenUrl, 'POST', dpopKey),
      },
      body: 'grant_type=client_credentials&scope=webid',
  });

  // This is the Access token that will be used to do an authenticated request to the server.
  // The JSON also contains an "expires_in" field in seconds,
  // which you can use to know when you need request a new Access token.
  const jason = await response.json();
  console.log("--This is jason: ", jason)
  const { access_token: accessToken } = jason

  console.log("--This is access token:", accessToken);
  //console.log("--This is dpop: ", dpopKey)

  return [dpopKey, accessToken];
}
