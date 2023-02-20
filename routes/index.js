const express = require('express');
const router = express.Router();
const data = require('../module5-data');
const patient_svc = require('../services/patient_svc');
const practitioner_svc = require('../services/practitioner_svc');
const practitionerrole_svc = require('../services/practitionerrole_svc');
const organization_svc = require('../services/organization_svc');

/* GET home page. */
router.get('/', async function(req, res, next) {

  try {

    // ensure patient exists and retieve from server 
    data.patient.id = '1835e4c0-1743-43ba-b554-f2aa0d091724';
    let patient = await patient_svc.readPatient(req.app, data.patient.id);
    patient = patient ?? await patient_svc.updatePatient(req.app, data.patient);
    req.session.patient_id = patient.id;

    // ensure placer practitioner exists and retrieve from server
    data.practitioner_placer.id = '565812a4-534c-4229-9709-b46f099ceb7a';
    let practitioner = await practitioner_svc.read(req.app, data.practitioner_placer.id);
    practitioner = practitioner ?? await practitioner_svc.update(req.app, data.practitioner_placer);
    req.session.practitioner_id = practitioner.id;

    // ensure placer practitioner role exists and retrieve from server
    let practitioner_role = await practitionerrole_svc.read(req.app, data.practitioner_role_placer.id);
    if (!practitioner_role) {
      data.practitioner_role_placer.practitioner.reference = `Practitioner/${data.practitioner_placer.id}`;
      practitioner_role = await practitionerrole_svc.update(req.app, data.practitioner_role_placer);
    }
    req.session.practitioner_role_id = practitioner_role.id;

    let placer_organization = await organization_svc.read(req.app, data.organization_placer.id);
    placer_organization = placer_organization ?? await organization_svc.update(req.app, data.organization_placer);
    req.session.placer_organization_id = placer_organization.id;

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
