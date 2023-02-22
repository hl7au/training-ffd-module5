const express = require('express');
const router = express.Router();
const data = require('../module5-data');
const patient_svc = require('../services/patient_svc');
const practitioner_svc = require('../services/practitioner_svc');
const practitionerrole_svc = require('../services/practitionerrole_svc');
const organization_svc = require('../services/organization_svc');

/* GET home page. */
router.get('/', async function(req, res, next) {

  // TODO: reassign new Resource Ids
  data.patient.id = "2aa71f2f-c243-4a3c-afb8-942e0fa8d0a8";
  data.organization_placer.id = "e1a663e5-f3c1-4442-ae8d-b34800e95b75";
  data.practitioner_placer.id = "fbee841f-2b12-4339-ba02-4be2d4807111";
  data.organization_filler.id = "0cc04380-fb0c-494b-a105-0188870f25fc";
  data.practitioner_role_placer.id = "a355d816-cfc0-401b-a7ca-744524bfa356";

  data.patient.managingOrganization.reference = "Organization/" + data.organization_placer.id;
  data.practitioner_role_placer.practitioner.reference = "Practitioner/" + data.practitioner_placer.id;
  data.practitioner_role_placer.organization.reference = "Organization/" + data.organization_placer.id;
  
  try {

    // ensure patient exists and retieve from server 
    let patient = await patient_svc.readPatient(req.app, data.patient.id);
    patient = patient ?? await patient_svc.updatePatient(req.app, data.patient);
    req.session.patient_id = patient.id;

    // ensure placer practitioner exists and retrieve from server
    let practitioner = await practitioner_svc.read(req.app, data.practitioner_placer.id);
    practitioner = practitioner ?? await practitioner_svc.update(req.app, data.practitioner_placer);
    req.session.practitioner_id = practitioner.id;

    console.log("Placer Organization");
    let placer_organization = await organization_svc.read(req.app, data.organization_placer.id);
    placer_organization = placer_organization ?? await organization_svc.update(req.app, data.organization_placer);
    req.session.placer_organization_id = placer_organization.id;

    console.log("Placer PractitionerRole");
    // ensure placer practitioner role exists and retrieve from server
    let practitioner_role = await practitionerrole_svc.read(req.app, data.practitioner_role_placer.id);
    if (!practitioner_role) {
      practitioner_role = await practitionerrole_svc.update(req.app, data.practitioner_role_placer);
    } 
    else {
      if (practitioner_role.practitioner.reference != data.practitioner_role_placer.practitioner.reference || 
        practitioner_role.organization.reference != data.practitioner_role_placer.organization.reference) {
          practitioner_role = await practitionerrole_svc.update(req.app, data.practitioner_role_placer);
        }
    }
    req.session.practitioner_role_id = practitioner_role.id;

    console.log("Filler Organization");
    let filler_organization = await organization_svc.read(req.app, data.organization_filler.id);
    filler_organization = filler_organization ?? await organization_svc.update(req.app, data.organization_filler);
    req.session.filler_organization_id = filler_organization.id;

    res.render('index', { title: 'FHIR Workflow', patient, practitioner, practitioner_role, placer_organization, filler_organization });
  }
  catch (error) {
    next(error);
  } 
});

module.exports = router;
