import { Session } from "@inrupt/solid-client-authn-node";
import { getSecret, getToken } from '../login/tokenGenerator.mjs';
import { readFileSync } from 'fs';
import {
    saveSolidDatasetAt,
    deleteSolidDataset,
    getSolidDataset,
    setThing,
    universalAccess,
    getSolidDatasetWithAcl,
    createContainerAt,
    saveSolidDatasetInContainer,
    createSolidDataset,
    buildThing,
    createThing,
    saveFileInContainer,
} from "@inrupt/solid-client";
import { ACL, RDF } from "@inrupt/vocab-common-rdf";

//get dataset
export const getDataSet = async (url) => {
    try {
        const session = new Session();
        //console.log("Session established");
        // Get client ID and client secret
        const [myClientId, myClientSecret] = await getSecret();
        //console.log("Secrets retrieved, myClientId:", myClientId, "myClientSecret:", myClientSecret);
        // Get DPoP and access token
        const [myDPoP, myAccessToken] = await getToken(myClientId, myClientSecret);
        console.log("Token retrieved", myDPoP, myAccessToken);
        
        if (myAccessToken === undefined) {
            console.log("No access token available. Please login first.");
            return null
        } else {
            // Assuming you have myIdentityProvider defined somewhere
            const myIdentityProvider = 'https://solid.interactions.ics.unisg.ch/'

            // Use async/await for better readability
            await session.login({
                clientId: myClientId,
                clientSecret: myClientSecret,
                oidcIssuer: myIdentityProvider,
                redirectUrl: 'http://localhost:3000'
            });
            
            if (session.info.isLoggedIn) {
                // Make authenticated request
                try {
                    console.log("Session:", session.info.isLoggedIn);
                    const myDataset = await getSolidDataset(
                        url,
                        { fetch: session.fetch }
                    );
                    session.logout();
                    return myDataset
                } catch (error) {
                    console.log(error);
                    session.logout();
                    return null
                }
            }
        }
    } catch (error) {
        console.log(error);
        return null
    }
};

export const createContainerWithContent = async (url, containerDataset) => {

    try {
        const session = new Session();
        // Get client ID and client secret
        const [myClientId, myClientSecret] = await getSecret();
        // Get DPoP and access token
        const [myDPoP, myAccessToken] = await getToken(myClientId, myClientSecret);
        if (myAccessToken === undefined) {
            console.log("No access token available. Please login first.");
        } else {
            // Assuming you have myIdentityProvider defined somewhere
            const myIdentityProvider = 'https://solid.interactions.ics.unisg.ch/'
            // Use async/await for better readability
            await session.login({
                clientId: myClientId,
                clientSecret: myClientSecret,
                oidcIssuer: myIdentityProvider,
                redirectUrl: 'http://localhost:3000'
            });
            if (session.info.isLoggedIn) {
                // Make authenticated request
                try {
                    const container = await createContainerAt(
                        url,
                        { fetch: session.fetch },             // fetch from authenticated Session
                        containerDataset
                    );
                    session.logout();
                } catch (error) {
                    console.log(error);
                    session.logout();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//write dataset

export const writeDatasetInContainer = async (containerUrl, dataset) => {

    try {
        const session = new Session();
        // Get client ID and client secret
        const [myClientId, myClientSecret] = await getSecret();
        // Get DPoP and access token
        const [myDPoP, myAccessToken] = await getToken(myClientId, myClientSecret);
        if (myAccessToken === undefined) {
            console.log("No access token available. Please login first.");
        } else {
            // Assuming you have myIdentityProvider defined somewhere
            const myIdentityProvider = 'https://solid.interactions.ics.unisg.ch/'
            // Use async/await for better readability
            await session.login({
                clientId: myClientId,
                clientSecret: myClientSecret,
                oidcIssuer: myIdentityProvider,
                redirectUrl: 'http://localhost:3000'
            });
            if (session.info.isLoggedIn) {
                // Make authenticated request
                try {
                    const savedSolidDataset = await saveSolidDatasetInContainer(
                        containerUrl,
                        dataset,
                        { fetch: session.fetch }             // fetch from authenticated Session
                    );
                    session.logout();
                } catch (error) {
                    console.log(error);
                    session.logout();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//add Thing to dataset
export const addThingToDataset = async (url, thing) => {

    try {
        const session = new Session();
        // Get client ID and client secret
        const [myClientId, myClientSecret] = await getSecret();
        // Get DPoP and access token
        const [myDPoP, myAccessToken] = await getToken(myClientId, myClientSecret);
        if (myAccessToken === undefined) {
            console.log("No access token available. Please login first.");
        } else {
            // Assuming you have myIdentityProvider defined somewhere
            const myIdentityProvider = 'https://solid.interactions.ics.unisg.ch/'
            // Use async/await for better readability
            await session.login({
                clientId: myClientId,
                clientSecret: myClientSecret,
                oidcIssuer: myIdentityProvider,
                redirectUrl: 'http://localhost:3000'
            });
            if (session.info.isLoggedIn) {
                // Make authenticated request
                try {
                    const myDataset = await getSolidDataset(
                        url,
                        { fetch: session.fetch }
                    );
                    const myDatasetWithThing = setThing(myDataset, thing);
                    const savedSolidDataset = await saveSolidDatasetAt(
                        url,
                        myDatasetWithThing,
                        { fetch: session.fetch }             // fetch from authenticated Session
                    );
                    session.logout();
                } catch (error) {
                    console.log(error);
                    session.logout();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}


//setAccessTo
export const setAccessToDataset = async (datasetUrl, receivingActor) => {

    try {
        const session = new Session();
        // Get client ID and client secret
        const [myClientId, myClientSecret] = await getSecret();
        // Get DPoP and access token
        const [myDPoP, myAccessToken] = await getToken(myClientId, myClientSecret);
        if (myAccessToken === undefined) {
            console.log("No access token available. Please login first.");
        } else {
            // Assuming you have myIdentityProvider defined somewhere
            const myIdentityProvider = 'https://solid.interactions.ics.unisg.ch/'
            // Use async/await for better readability
            await session.login({
                clientId: myClientId,
                clientSecret: myClientSecret,
                oidcIssuer: myIdentityProvider,
                redirectUrl: 'http://localhost:3000'
            });
            if (session.info.isLoggedIn) {
                // Make authenticated request
                try {
                    let aclDataSet = createSolidDataset();
                    const accessRight1 = await buildThing(createThing({ name: "authOf" }))
                        .addUrl(RDF.type, ACL.Authorization)
                        .addUrl(ACL.agent, receivingActor)
                        .addUrl(ACL.accessTo, datasetUrl)
                        .addUrl(ACL.mode, ACL.Read)
                        .addUrl(ACL.default, datasetUrl)
                        .build();
                    const accessRight2 = await buildThing(createThing({ name: "author" }))
                        .addUrl(RDF.type, ACL.Authorization)
                        .addUrl(ACL.agent, 'https://solid.interactions.ics.unisg.ch/ucJan/profile/card#me')
                        .addUrl(ACL.accessTo, datasetUrl)
                        .addUrl(ACL.mode, ACL.Read)
                        .addUrl(ACL.mode, ACL.Write)
                        .addUrl(ACL.mode, ACL.Control)
                        .addUrl(ACL.mode, ACL.Append)
                        .addUrl(ACL.default, datasetUrl)
                        .build();
                    aclDataSet = setThing(aclDataSet, accessRight1)
                    aclDataSet = setThing(aclDataSet, accessRight2)

                    const savedSolidDataset = await saveSolidDatasetAt(
                        datasetUrl + '.acl',
                        aclDataSet,
                        { fetch: session.fetch }             // fetch from authenticated Session
                    );

                    session.logout();
                } catch (error) {
                    console.log(error);
                    session.logout();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}


//saveFile
//setAccessTo
export const saveFileToContainer = async (containerUrl, filePath, contentType) => {
    try {
        const session = new Session();
        // Get client ID and client secret
        const [myClientId, myClientSecret] = await getSecret();
        // Get DPoP and access token
        const [myDPoP, myAccessToken] = await getToken(myClientId, myClientSecret);
        if (myAccessToken === undefined) {
            console.log("No access token available. Please login first.");
        } else {
            // Assuming you have myIdentityProvider defined somewhere
            const myIdentityProvider = 'https://solid.interactions.ics.unisg.ch/'
            // Use async/await for better readability
            await session.login({
                clientId: myClientId,
                clientSecret: myClientSecret,
                oidcIssuer: myIdentityProvider,
                redirectUrl: 'http://localhost:3000'
            });
            if (session.info.isLoggedIn) {
                // Make authenticated request
                try {
                    const fileContent = readFileSync(filePath, 'utf-8');
                    const file = new Uint8Array(Buffer.from(fileContent));
                    const savedFile = await saveFileInContainer(
                        containerUrl,
                        file,
                        { slug: filePath, contentType: contentType, fetch: session.fetch }
                    );

                    session.logout();
                } catch (error) {
                    console.log(error);
                    session.logout();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}


//removeAccessTo
export const removeAccessToDataset = async (datasetUrl, receivingActor) => {

    try {
        const session = new Session();
        // Get client ID and client secret
        const [myClientId, myClientSecret] = await getSecret();
        // Get DPoP and access token
        const [myDPoP, myAccessToken] = await getToken(myClientId, myClientSecret);
        if (myAccessToken === undefined) {
            console.log("No access token available. Please login first.");
        } else {
            // Assuming you have myIdentityProvider defined somewhere
            const myIdentityProvider = 'https://solid.interactions.ics.unisg.ch/'
            // Use async/await for better readability
            await session.login({
                clientId: myClientId,
                clientSecret: myClientSecret,
                oidcIssuer: myIdentityProvider,
                redirectUrl: 'http://localhost:3000'
            });
            if (session.info.isLoggedIn) {
                // Make authenticated request
                try {
                    const savedSolidDataset = await deleteSolidDataset(
                        datasetUrl + '.acl',
                        { fetch: session.fetch }             // fetch from authenticated Session
                    );
                    session.logout();
                } catch (error) {
                    console.log(error);
                    session.logout();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}




//delete dataset

export const deleteDataSet = async (url) => {
    try {
        const session = new Session();

        // Get client ID and client secret
        const [myClientId, myClientSecret] = await getSecret();

        // Get DPoP and access token
        const [myDPoP, myAccessToken] = await getToken(myClientId, myClientSecret);

        if (myAccessToken === undefined) {
            console.log("No access token available. Please login first.");
        } else {
            // Assuming you have myIdentityProvider defined somewhere
            const myIdentityProvider = 'https://solid.interactions.ics.unisg.ch/'

            // Use async/await for better readability
            await session.login({
                clientId: myClientId,
                clientSecret: myClientSecret,
                oidcIssuer: myIdentityProvider,
                redirectUrl: 'http://localhost:3000'
            });

            if (session.info.isLoggedIn) {
                // Make authenticated request
                try {
                    await deleteSolidDataset(
                        url,
                        { fetch: session.fetch }           // fetch function from authenticated session
                    );
                    session.logout();
                } catch (error) {
                    console.log(error);
                    session.logout();
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};
