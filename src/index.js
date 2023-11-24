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
import { getDataSet, setOccupation, writeDatasetInContainer, deleteDataSet, addThingToDataset, setAccessToDataset, createContainerWithContent, removeAccessToDataset, saveFileToContainer } from './REST/dataSetUtil.js'


const app = express();

const hostname = '127.0.0.1';
const port = 3000;


app.get('/getFederated/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  const url = `https://solid.interactions.ics.unisg.ch/robotSG/`
  console.log("URL: ", url)
  getDataSet(url).then((result) => {
    if (result !== null) {
      //console.log("Dataset loaded", result);
      let resultString =  ""
      getThingAll(result).forEach((thing) => {
        resultString = resultString + "\n Thing:" + thingAsMarkdown(thing);
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


app.get('/get/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  const url = `https://solid.interactions.ics.unisg.ch/picture/${containerName}/`
  console.log("URL: ", url)
  getDataSet(url).then((result) => {
    if (result !== null) {
      //console.log("Dataset loaded", result);
      let resultString =  ""
      getThingAll(result).forEach((thing) => {
        resultString = resultString + "\n Thing:" + thingAsMarkdown(thing);
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

app.get('/getActivityFileFromLukas/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  const url = `https://solid.interactions.ics.unisg.ch/podsuana/gazeData/currentActivity.ttl`
  
  console.log("URL: ", url)
  getDataSet(url).then((result) => {
    console.log("Result: ", result)
    let name = ""
    let associatedWith = ""
    let probability = ""
    if (result !== null) {
      //console.log("Dataset loaded", result);
      let resultString =  ""
      getThingAll(result).forEach((thing) => {
        if(thing.url.includes("Activity")){
          console.log("Thing:", thing); 
          name = thing.predicates["https://schema.org/name"].literals["http://www.w3.org/2001/XMLSchema#string"][0]
          console.log("Name: ", name)
          associatedWith = thing.predicates["http://www.w3.org/ns/prov#wasAssociatedWith"].namedNodes[0]
          console.log("Associated with: ", associatedWith)
          probability = thing.predicates["http://bimerr.iot.linkeddata.es/def/occupancy-profile#probability"].literals["http://www.w3.org/2001/XMLSchema#float"][0]
          console.log("Probability: ", probability)
        }
       
      });
      response.send("Name: " + name + " Associated with: " + associatedWith + " Probability: " + probability)
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


app.get('/getActivityFile/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  const url = `https://solid.interactions.ics.unisg.ch/picture/${containerName}/currentActivity.ttl`
  console.log("URL: ", url)
  getDataSet(url).then((result) => {
    let name = ""
    let associatedWith = ""
    let probability = ""
    if (result !== null) {
      //console.log("Dataset loaded", result);
      let resultString =  ""
      getThingAll(result).forEach((thing) => {
        if(thing.url.includes("Activity")){
          console.log("Thing:", thing); 
          name = thing.predicates["https://schema.org/name"].literals["http://www.w3.org/2001/XMLSchema#string"][0]
          console.log("Name: ", name)
          associatedWith = thing.predicates["http://www.w3.org/ns/prov#wasAssociatedWith"].namedNodes[0]
          console.log("Associated with: ", associatedWith)
          probability = thing.predicates["http://bimerr.iot.linkeddata.es/def/occupancy-profile#probability"].literals["http://www.w3.org/2001/XMLSchema#float"][0]
          console.log("Probability: ", probability)
        }
       
      });
      response.send("Name: " + name + " Associated with: " + associatedWith + " Probability: " + probability)
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


app.get('/getACL', (request, response) => {
  const containerName = request.params.containerName;
  const url = `https://solid.interactions.ics.unisg.ch/picture/gazeData/.acl`
  console.log("URL: ", url)
  getDataSet(url).then((result) => {
    if (result !== null) {
      //console.log("Dataset loaded", result);
      let resultString =  ""
      getThingAll(result).forEach((thing) => {
        resultString = resultString + "\n Thing:" + thingAsMarkdown(thing);
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

app.get('/saveFileToContainer/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  saveFileToContainer(`https://solid.interactions.ics.unisg.ch/picture/${containerName}/`, 'classifiedActivityVocab.ttl',"text/turtle")
  response.send("saved")
})

app.get('/saveActivityToContainer/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  saveFileToContainer(`https://solid.interactions.ics.unisg.ch/picture/${containerName}/`, 'currentActivity.ttl',"text/turtle")
  response.send("saved")
})

app.get('/saveRawFileToContainer/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  saveFileToContainer(`https://solid.interactions.ics.unisg.ch/picture/${containerName}/`, 'raw_gaze_data.csv',"text/csv")
  response.send("saved")
})

app.get('/saveSongFileToContainer/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  saveFileToContainer(`https://solid.interactions.ics.unisg.ch/picture/${containerName}/`, 'songs2.txt',"text/plain")
  response.send("saved")
})

app.get('/saveHobbyFileToContainer/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  saveFileToContainer(`https://solid.interactions.ics.unisg.ch/picture/${containerName}/`, 'myhobbies.txt',"text/plain")
  response.send("saved")
})

app.get('/createContainerWithContent/:containerName', (request, response) => {  
  const containerName = request.params.containerName;
  createContainerWithContent(`https://solid.interactions.ics.unisg.ch/picture/${containerName}`,  createSolidDataset())
  response.send("created")
})

app.get('/setAccessToDataset/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  setAccessToDataset(`https://solid.interactions.ics.unisg.ch/picture/${containerName}/`, 'https://solid.interactions.ics.unisg.ch/picture/profile/card#me')
  response.send("set")
})

app.get('/removeAccessToDataset/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  removeAccessToDataset(`https://solid.interactions.ics.unisg.ch/picture/${containerName}/`, 'https://solid.interactions.ics.unisg.ch/ucJan/profile/card#me')
  response.send("removed")
})

app.get('/createContainer/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  createContainerAt(`https://solid.interactions.ics.unisg.ch/picture/${containerName}/`)
  response.send("created")
})

app.get('/deleteDataSet/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  deleteDataSet(`https://solid.interactions.ics.unisg.ch/picture/${containerName}/`)
  response.send("deleted")
})

app.get('/addThingToDataset/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  const bookUrl = `https://solid.interactions.ics.unisg.ch/picture/${containerName}/`
  const courseSolidDataset = createSolidDataset();
  const newBookThing1 = createThing({ name: "Thing1" });
  addThingToDataset(bookUrl, newBookThing1)
  response.send("added")
})

app.get('/writeDatasetInContainer/:containerName', (request, response) => {
  const containerName = request.params.containerName;
  const bookUrl = `https://solid.interactions.ics.unisg.ch/picture/${containerName}/`
  const courseSolidDataset = createSolidDataset();
  writeDatasetInContainer(bookUrl, courseSolidDataset)
  response.send("written")
})

app.get('/please', (request, response) => {
  setOccupation('https://solid.interactions.ics.unisg.ch/picture/profile/card')
  response.send("please")
}
)

