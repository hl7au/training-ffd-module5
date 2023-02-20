const http = require('axios');

async function readPractitioner (app, id) {
  const req_config = { 
    baseURL: app.locals.fhir_base_url,
    url: `Practitioner/${id}`,
    headers: { 'Accept': 'application/json' }
  }

  try {
    console.log(`GET ${req_config.baseURL}/${req_config.url}`);
    
    const response = await http.request(req_config);
    console.log(`${response.status} ${response.statusText}`);

    return response.data;
  } 
  catch (error) {
    if (error.response !== undefined) {
      console.log(`${error.response.status} ${error.response.statusText}`);

      if (error.response.status == 404) {
        return null;
      }
      console.log(JSON.stringify(error.response.data));
    }

    throw( error );
  }
}

async function createPractitioner(app, practitioner) {
  if (practitioner === null) throw ("practitioner must not be null");
  if (practitioner.id !== undefined) 
    throw ("practitioner id must be undefined");
  if (practitioner.resourceType === undefined || practitioner.resourceType != "Practitioner") 
    throw ("practitioner resourceType must be 'Practitioner'");

  const req_config = { 
    baseURL: app.locals.fhir_base_url,
    headers: { 'Accept': 'application/json' }}

  console.log("Creating Practitioner");

  try {
    const response = await http.post("Practitioner", practitioner, req_config);
    console.log(`${response.status} ${response.statusText}`);
    
    return response.data;
  } 
  catch (error) {
    if (error.response !== undefined) {
      console.log(`${error.response.status} ${error.response.statusText}`);
      console.log(JSON.stringify(error.response.data));
    }
    throw( error );
  }
}

async function updatePractitioner(app, practitioner) {

  if (practitioner === null) throw ("practitioner must not be null");
  if (practitioner.id === undefined || practitioner.id === null) 
    throw ("practitioner id must not be null");
  if (practitioner.resourceType === undefined || practitioner.resourceType != "Practitioner") 
    throw ("practitioner resourceType must be 'Practitioner'");

  const req_config = { 
    method: 'put',
    baseURL: app.locals.fhir_base_url,
    url: `Practitioner/${practitioner.id}`,
    data: practitioner, 
    headers: { 'Accept': 'application/json' }}

  console.log("Updating practitioner " + practitioner.id);

  try {
    const response = await http.request(req_config);
    console.log(`${response.status} ${response.statusText}`);
    
    return response.data;
  } 
  catch (error) {
    if (error.response !== undefined) {
      console.log(`${error.response.status} ${error.response.statusText}`);
      console.log(JSON.stringify(error.response.data));
    }

    throw( error );
  }
}

module.exports = {
  read: readPractitioner,
  create: createPractitioner,
  update: updatePractitioner  
}