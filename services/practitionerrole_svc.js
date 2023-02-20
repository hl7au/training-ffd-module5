const http = require('axios');

const resourceType = 'PractitionerRole';

async function readResource (app, id) {
  const req_config = { 
    baseURL: app.locals.fhir_base_url,
    headers: { 'Accept': 'application/json' }
  }

  const url = `${resourceType}/${id}`;

  try {
    console.log(`GET ${req_config.baseURL}/${url}`);
    
    const response = await http.get(url, req_config);
    console.log(`${response.status} ${response.statusText}`);

    return response.data;
  } 
  catch (error) {
    if (error.response !== undefined) {
      console.log(`${error.response.status} ${error.response.statusText}`);

      if (error.response.status == 404) {
        if (error.response.data)
          console.log(JSON.stringify(error.response.data.issue[0].diagnostics));

        return null;
      }
      console.log(JSON.stringify(error.response.data));
    }

    throw( error );
  }
}

async function createResource(app, resource) {
  if (resource === null) throw ("resource must not be null");
  if (resource.id !== undefined) 
    throw ("resource id must be undefined");
  if (resource.resourceType === undefined || resource.resourceType != resourceType) 
    throw (`resource resourceType must be '${resourceType}'`);

  const req_config = { 
    baseURL: app.locals.fhir_base_url,
    headers: { 'Accept': 'application/json' }};
  
  const url = `${resourceType}`;
  console.log(`Creating ${resourceType}`);

  try {
    console.log(`POST ${req_config.baseURL}/${url}`);

    const response = await http.post(url, resource, req_config);
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

async function updateResource(app, resource) {

  if (resource === null) throw ("resource must not be null");
  if (resource.id === undefined || resource.id === null) 
    throw ("resource id must not be null");
  if (resource.resourceType === undefined || resource.resourceType != resourceType) 
    throw (`resource resourceType must be '${resourceType}'`);

  const req_config = { 
//    method: 'put',
    baseURL: app.locals.fhir_base_url,
    //url: `Practitioner/${practitioner.id}`,
//    data: resource, 
    headers: { 'Accept': 'application/json' }
  }


  console.log(`Updating ${resourceType}/${resource.id}`);
  const url = `${resourceType}/${resource.id}`;

  //console.log(request_url);
  console.log(`PUT ${req_config.baseURL}/${url}`);

  try {
    const response = await http.put(url, resource, req_config);
    console.log(`${response.status} ${response.statusText}`);
    
    return response.data;
  } 
  catch (error) {
    if (error.response) {
      console.log(`${error.response.status} ${error.response.statusText}`);
      console.log(JSON.stringify(error.response.data));
    }
    else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js

      //console.log("error.request -------------------");
      //console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("error.message --------------------");
      console.log('Error', error.message);
    }
    console.log("error.config -----------------------");
    console.log(error.config);

//    console.log("error.toJSON() ----------------------");
//    console.log(error.toJSON());

    throw( error );
  }
}

module.exports = {
  read: readResource,
  create: createResource,
  update: updateResource  
}