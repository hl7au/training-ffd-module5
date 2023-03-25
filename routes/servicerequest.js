const express = require('express');
const router = express.Router();
const patient_svc = require('../services/patient_svc');
const practitioner_svc = require('../services/practitioner_svc');
const practitionerrole_svc = require('../services/practitionerrole_svc');
const organization_svc = require('../services/organization_svc');
const servicerequest_svc = require('../services/servicerequest_svc');

function buildServiceRequest(data) {
  const servicerequest = {
    resourceType: "ServiceRequest",
    meta: {
      profile: [ "http://hl7.org.au/fhir/StructureDefinition/au-diagnosticrequest" ]
    },

    // requisition
    requisition: {        
      type: {
        coding: [{
          code: "PGN", 
          display: "Placer Group Identifier",
          system: "http://terminology.hl7.org/CodeSystem/v2-0203"
        }]
      },

      value: data.placer_group_identifier,
      system: 'http://ns.electronichealth.net.au/id/hpio-scoped/order/1.0/' + data.placer_organization_hpio,
      assigner: {
        display: data.placer_organization_name 
      }
    },

    // TODO: status { status }
    status: data.status,

    // TODO: intent { 'order' }
    intent: "order",

    // TODO: category
    category: [
      {
        coding: [
          {
            code: data.category_code,
            display: data.category_display,
            system: "http://snomed.info/sct"
          }
        ]
      }
    ],

    // TODO: priority { priority }
    priority: data.priority,

    // TODO: code { request_code_code, request_code_display, 'http://snomed.info/sct' }
    code: {
      coding: [
        {
          code: data.request_code_code,                    
          display: data.request_code_display,
          system: "http://snomed.info/sct"
        }
      ]
    },

    // TODO: subject { patient_id }
    subject: {
      reference: "Patient/" + data.patient_id
    },

    // TODO: authoredOn { authoredOn }
    authoredOn: data.authoredOn,
    
    // TODO: requester { placer_practitionerrole_id }
    requester: {
      reference: "PractitionerRole/" + data.placer_practitionerrole_id
    },

    // TODO: performerType { performerType_code, performerType_display, 'http://snomed.info/sct' }
    performerType: {
      coding: [
        {
        code: data.performerType_code,
        display: data.performerType_display,
        system: "http://snomed.info/sct"
        }
      ]
    }    
  }
  
  // conditionally populate when reasonCode provided
  if (data.reasonCode_code) {

    // TODO: reasonCode { reasonCode_code, reasonCode_display }
    servicerequest.reasonCode = [
      {        
        coding: [
          {
            code: data.reasonCode_code,
            display: data.reasonCode_display,
            system:  "http://snomed.info/sct"
          }
        ]  
      }
    ]
  }

  return servicerequest;
}

router.get('/', async function(req, res, next) {
  const session = req.session;

  if (session.patient_id) {
    let patient = await patient_svc.readPatient(req.app, session.patient_id);
    let practitioner = await practitioner_svc.read(req.app, session.practitioner_id);
    let practitioner_role = await practitionerrole_svc.read(req.app, session.practitioner_role_id);
    let placer_organization = await organization_svc.read(req.app, session.placer_organization_id);
    let filler_organization = await organization_svc.read(req.app, session.filler_organization_id);

    res.render('servicerequest-create', { title: 'New Service Request', patient, practitioner, practitioner_role, placer_organization, filler_organization });
  }
  else {
    console.log("session.patient_id is not set, session cookie may not be getting saved");
    res.redirect("/");  // initialise app
  }
});

router.post('/', async function(req, res, next) {
  const data = req.body;

  try {
    if (data.request_code === undefined) throw ("Service requested is required");

    // requisition placer group identifier
    data.placer_group_identifier = GeneratePlacerGroupId(data.placer_organization_hpio);

    // status
    data.status = "active";
    
    // catgeory
    data.category_code = "363679005";
    data.category_display = "Imaging";

    // request code coding
    const request_code = SplitCoding(data.request_code);
    data.request_code_code = request_code.code;
    data.request_code_display = request_code.display;
    
    // performerType
    data.performerType_code = "78729002";
    data.performerType_display = "Diagnostic radiologist";

    // authoredOn
    data.authoredOn = new Date().toISOString();

    console.log(data);

    const servicerequest = buildServiceRequest(data);
    const validate_result = await servicerequest_svc.validate(req.app, servicerequest);
    const result = await servicerequest_svc.create(req.app, servicerequest);

    res.redirect(`/servicerequest/${result.id}`);
  }
  catch (error) {
    next(error);
  } 

});

router.get('/:id', async function(req, res, next) {

  const id = req.params['id'];
  try {
    const servicerequest = await servicerequest_svc.read(req.app, id, true);
    res.render('servicerequest-view', { title: 'Service Request', servicerequest });
  }
  catch (error) {
    next(error);
  } 
});

function GeneratePlacerGroupId(placer_organization_hpio) {
  return `ORD${placer_organization_hpio.substring(11)}-${String(Math.floor(Math.random() * 1000000)).padStart(5, "0")}`;
}

function SplitCoding(request_code)     {
  if ( request_code !== '') {
    const service_parts =  request_code.split(' ');  
    const request_code_code = service_parts[0];
    // trim double quotes from start and end
    const request_code_display = service_parts[1].replace(/^"(.+(?="$))"$/, '$1');

    return { code: request_code_code, display: request_code_display };
  }
  else
    return undefined;
}

module.exports = router;
