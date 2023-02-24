const http = require('axios');
const url = require('url');

module.exports = {
  readPatient: async function (app, patientId) {
    const request_url = new URL(app.locals.fhir_base_url);
    request_url.pathname = request_url.pathname + "/Patient/" + patientId;

    const req_config = { headers: { 'Accept': 'application/json' }}

    try {
      console.log("GET " + request_url.href);
      const response = await http.get(request_url.href, req_config);
      console.log(`${response.status} ${response.statusText}`);
      return response.data;

    } 
    catch (error) {
      console.log(`${error.response.status} ${error.response.statusText}`);
      if (error.response.status == 404) {
        return null;
      }
      console.log(JSON.stringify(error.response.data));
      throw( error );
    }
  },

  createPatient: async function (app, patient) {
    const request_url = new URL(app.locals.fhir_base_url);
    request_url.pathname = request_url.pathname + "/Patient";

    console.log(patient);

    try {
      const response = await http.post(request_url.href, patient);
      console.log(`${response.status} ${response.statusText}`);
      
      return response.data;
    } 
    catch (error) {
      console.log(`${error.response.status} ${error.response.statusText}`);
      console.log(JSON.stringify(error.response.data));
      throw( error );
    }
  },

  updatePatient: async function (app, patient) {

    if (patient === null) throw ("patient must not be null");
    if (patient.id === undefined || patient.id === null) throw ("patient id must not be null");

    const request_url = new URL(app.locals.fhir_base_url);//url.parse(app.locals.fhir_base_url);
    request_url.pathname = `${request_url.pathname}/Patient/${patient.id}`;

    console.log("Updating patient " + patient.id);
    console.log("PUT " + request_url.href);

    try {
      const response = await http.put(request_url.href, patient);
      console.log(`${response.status} ${response.statusText}`);
      
      return response.data;
    } 
    catch (error) {
      console.log(`${error.response.status} ${error.response.statusText}`);
      console.log(JSON.stringify(error.response.data));
      throw( error );
    }
  }
}