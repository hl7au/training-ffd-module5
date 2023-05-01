const express = require('express');
const router = express.Router();
const patient_svc = require('../services/patient_svc');
const practitioner_svc = require('../services/practitioner_svc');
const practitionerrole_svc = require('../services/practitionerrole_svc');
const organization_svc = require('../services/organization_svc');
const servicerequest_svc = require('../services/servicerequest_svc');
const task_svc = require('../services/task_svc');

function buildTask(data) {
  const task = {
    resourceType: "Task",

    // groupIdentifier
    groupIdentifier: {
      type: {
        coding: [{
          code: "PGN", 
          display: "Placer Group Identifier",
          system: "http://terminology.hl7.org/CodeSystem/v2-0203"
        }]
      },
      value: data.placer_group_identifier,
      system: "http://ns.electronichealth.net.au/id/hpio-scoped/order/1.0/" + data.placer_organization_hpio,  
      assigner: { 
        display: data.placer_organization_name 
      }  
    },

    // TODO: status { status }
    status: data.status,

    // TODO: intent { 'order' }
    intent: "order",

    // TODO: priority { priority }
    priority: data.priority,

    // TODO: code { code: 'fulfill', display: 'Fulfill the focal request', system: 'http://hl7.org/fhir/CodeSystem/task-code' }
    code: {
      coding: [
        {
          code: "fulfill",
          display: "Fulfill the focal request",
          system: "http://hl7.org/fhir/CodeSystem/task-code"
        }
      ]
    },

    // TODO: description { description }
    description: data.description,

    // TODO: focus { servicerequest_id }
    focus: {
      reference: "ServiceRequest/" + data.servicerequest_id
    },

    // TODO: for { patient_id }
    for: {
      reference: "Patient/" + data.patient_id
    },

    // TODO: authoredOn { authoredOn }
    authoredOn: data.authoredOn,

    // TODO: requester { placer_practitionerrole_id }
    requester: {
      reference: "PractitionerRole/" + data.placer_practitionerrole_id
    },

    // TODO: owner { filler_organization_id }
    owner: {
      reference: "Organization/" + data.filler_organization_id
    }
  }

  // conditionally populate when performerType provided
  if (data.performerType_code) {
      // TODO: performerType { performerType_code, performerType_display }
      task.performerType = [
        {
          coding: [
            {
              code: data.performerType_code,
              display: data.performerType_display,
              system: "http://snomed.info/sct"
            }
          ]
        }
      ]
  }
  
  
  return task;
}

router.get('/', async function(req, res, next) {
  const query = req.query;
  const session = req.session;

  try {
    if (query.servicerequest_id === undefined) throw ("servicerequest_id is required");

    if (session.patient_id) {
      let patient = await patient_svc.readPatient(req.app, session.patient_id);
      let practitioner = await practitioner_svc.read(req.app, session.practitioner_id);
      let practitioner_role = await practitionerrole_svc.read(req.app, session.practitioner_role_id);
      let placer_organization = await organization_svc.read(req.app, session.placer_organization_id);
      let filler_organization = await organization_svc.read(req.app, session.filler_organization_id);
      let servicerequest = await servicerequest_svc.read(req.app, query.servicerequest_id);

      res.render('task-create', { title: 'Service Fulfilment Task', patient, practitioner, practitioner_role, placer_organization, filler_organization, servicerequest });
    }
    else {
      console.log("session.patient_id is not set, session cookie may not be getting saved");
      res.redirect("/");  // initialise app
    }
  }
  catch (error) {
    console.log(error);
    next(error);
  } 
});

router.post('/', async function(req, res, next) {
  const data = req.body;

  try {
    // group identifier
    if (data.placer_group_identifier === undefined) throw ("Placer group identifier is required");

    // status
    data.status = "requested";
    
    // authoredOn
    if (data.authoredOn === undefined) throw ("Authored on is required");

    console.log(data);
    const task = buildTask(data);

    console.log(task);
    const validate_result = await task_svc.validate(req.app, task);
    const result = await task_svc.create(req.app, task);

    res.redirect(`/task/${result.id}`);
  }
  catch (error) {
    console.log(error);

    next(error);
  } 

});

router.get('/:id', async function(req, res, next) {

  const id = req.params['id'];
  try {
    const task = await task_svc.read(req.app, id, true);
    res.render('task-view', { title: 'Task', task });
  }
  catch (error) {
    console.log(error);

    next(error);
  } 
});


module.exports = router;
