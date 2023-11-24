import { RDF } from '@inrupt/vocab-common-rdf';
import express from 'express';
import {
  buildThing,
  createSolidDataset,
  createThing,
  setThing,
  getThingAll,
  thingAsMarkdown,
  createContainerAt,
} from "@inrupt/solid-client";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { getDataSet, writeDatasetInContainer, deleteDataSet, addThingToDataset, setAccessToDataset, createContainerWithContent, removeAccessToDataset, saveFileToContainer } from './REST/dataSetUtil.js'


const app = express();

const hostname = '127.0.0.1';
const port = 3000;

const [myClientId, myClientSecret] = await getSecret();
        //console.log("Secrets retrieved, myClientId:", myClientId, "myClientSecret:", myClientSecret);
        // Get DPoP and access token
const [myDPoP, myAccessToken] = await getToken(myClientId, myClientSecret);
        console.log("Tokens retrieved, myDPoP:", myDPoP, "myAccessToken:", myAccessToken);
        // Get session

app.get('/', (request, response) => {
  getDataSet('https://solid.interactions.ics.unisg.ch/ucJan/gazeContainer/').then((result) => {
    if (result !== null) {
      //console.log("Dataset loaded", result);
      let result =  ""
      getThingAll(result).forEach((thing) => {
        result = result + "\n Thing:" + thingAsMarkdown(thing);
      });
      response.send(result)
    } else {
      //console.log("Error in runApplication");
      response.status(500).send('Something broke!')
    }
  })
    .catch((error) => {
      console.error("Unhandled error:", error);
      response.status(500).send('Something broke!')
    });
})

app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});


//saveFileToContainer('https://solid.interactions.ics.unisg.ch/ucJan/gazeContainer/', 'classifiedActivityVocab.ttl',"text/turtle")

//setAccessToDataset('https://solid.interactions.ics.unisg.ch/ucJan/gazeContainer/', 'https://solid.interactions.ics.unisg.ch/LarsLaufen/profile/card#me')
//let gazeDatset = createSolidDataset();
//createContainerWithContent('https://solid.interactions.ics.unisg.ch/ucJan/gazeContainer',  gazeDatset)

//removeAccessToDataset('https://solid.interactions.ics.unisg.ch/ucJan/books/', 'https://solid.interactions.ics.unisg.ch/LarsLaufen/profile/card#me')

//writeDatasetInContainer(bookUrl, courseSolidDataset)
//addThingToDataset(bookUrl, newBookThing1)

//deleteDataSet('https://solid.interactions.ics.unisg.ch/ucJan/Activity/')


