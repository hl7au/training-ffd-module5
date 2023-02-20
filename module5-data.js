  const patient = {
            "id": "df27b682-a4ee-4a6d-8ce6-1f3dd0476008",
            "meta": {
              "profile": [
                "http://hl7.org.au/fhir/StructureDefinition/au-patient"
              ]
            },
            "birthDate": "1967-01-20",
            "gender": "male",
            "identifier": [
              {
                "system": "http://ns.electronichealth.net.au/id/medicare-number",
                "type": {
                  "coding": [
                    {
                      "code": "MC",
                      "display": "Patient's Medicare Number",
                      "system": "http://terminology.hl7.org/CodeSystem/v2-0203"
                    }
                  ]
                },
                "value": "31169597700"
              },
              {
                "system": "http://ns.electronichealth.net.au/id/hi/ihi/1.0",
                "type": {
                  "coding": [
                    {
                      "code": "NI",
                      "display": "National unique individual identifier",
                      "system": "http://terminology.hl7.org/CodeSystem/v2-0203"
                    }
                  ],
                  "text": "National unique individual identifier"
                },
                "value": "8003604153845143"
              },
              {
                "system": "http://ns.electronichealth.net.au/id/dva",
                "type": {
                  "coding": [
                    {
                      "code": "DVAU",
                      "display": "DVA Number",
                      "system": "http://terminology.hl7.org.au/CodeSystem/v2-0203"
                    }
                  ],
                  "text": "DVA Number"
                },
                "value": "WARX2617A"
              }
            ],
            "managingOrganization": {
              "reference": "Organization/68821c8e-117a-4a30-8e19-2f3ed4f3ed25"
            },
            "name": [
              {
                "family": "Smyth",
                "given": [
                  "John"
                ],
                "prefix": [
                  "Mr"
                ],
                "use": "official"
              }
            ],
            "resourceType": "Patient"
          }

  const practitioner_placer = {
              "id": "c97830e5-34f4-41de-8710-a99e06cf9022",
              "meta": {
                "profile": [
                  "http://hl7.org.au/fhir/StructureDefinition/au-practitioner"
                ]
              },
              "active": true,
              "identifier": [
                {
                  "system": "http://ns.electronichealth.net.au/id/hi/hpii/1.0",
                  "type": {
                    "coding": [
                      {
                        "code": "NPI",
                        "display": "National provider identifier",
                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203"
                      }
                    ]
                  },
                  "value": "8003616961374504"
                }
              ],
              "name": [
                {
                  "family": "Royles",
                  "given": [
                    "Fredrick"
                  ],
                  "prefix": [
                    "Prof"
                  ],
                  "use": "official"
                }
              ],
              "resourceType": "Practitioner"
            }

  const practitioner_role_placer = {
                "id": "b4c70d3a-8948-487e-b9a2-bd709c3c9b99",
                "meta": {
                  "profile": [
                    "http://hl7.org.au/fhir/StructureDefinition/au-practitionerrole"
                  ]
                },
                "identifier": [
                  {
                    "system": "http://ns.electronichealth.net.au/id/medicare-provider-number",
                    "type": {
                      "coding": [
                        {
                          "code": "UPIN",
                          "display": "Medicare Provider Number",
                          "system": "http://terminology.hl7.org.au/CodeSystem/v2-0203"
                        }
                      ]
                    },
                    "value": "7135617T"
                  }
                ],
                "location": [
                  {
                    "display": "Bones R Us - Level 2, 20 James St, Sydney, NSW, 2000"
                  }
                ],
                "organization": {
                  "reference": "Organization/68821c8e-117a-4a30-8e19-2f3ed4f3ed25"
                },
                "practitioner": {
                  "reference": "Practitioner/c97830e5-34f4-41de-8710-a99e06cf9022"
                },
                "code": [
                  {
                    "coding": [
                      {
                      "code": "22731001",
                      "display": "Orthopaedic surgeon",
                      "system": "http://snomed.info/sct"
                      }
                    ]
                  }
                ],
                "resourceType": "PractitionerRole"
            }

  const organization_placer =  {
          "id": "68821c8e-117a-4a30-8e19-2f3ed4f3ed25",
          "meta": {
            "profile": [
              "http://hl7.org.au/fhir/StructureDefinition/au-organization"
            ]
          },
          "identifier": [
            {
              "system": "http://ns.electronichealth.net.au/id/hi/hpio/1.0",
              "type": {
                "coding": [
                  {
                    "code": "NOI",
                    "display": "HPI-O",
                    "system": "http://terminology.hl7.org.au/CodeSystem/v2-0203"
                  }
                ]
              },
              "value": "8003626126014481"
            }
          ],
          "name": "Bones R Us",
          "resourceType": "Organization"
        }

  const organization_filler = {
            "id": "7c444363-60ed-487d-a928-0757a6dabbdb",
            "meta": {
              "profile": [
                "http://hl7.org.au/fhir/StructureDefinition/au-organization"
              ]
            },
            "identifier": [
              {
                "system": "http://ns.electronichealth.net.au/id/hi/hpio/1.0",
                "type": {
                  "coding": [
                    {
                      "code": "NOI",
                      "display": "HPI-O",
                      "system": "http://terminology.hl7.org.au/CodeSystem/v2-0203"
                    }
                  ]
                },
                "value": "8003624166708567"
              }
            ],
            "type": [
              {
                "coding": [
                  {
                  "code": "846664008",
                  "display": "Community radiology",
                  "system": "http://snomed.info/sct"
                  }
                ]
              }
            ],
            "name": "X-Radiology",
            "resourceType": "Organization"
          }

module.exports = {
    patient: patient,
    practitioner_placer: practitioner_placer,
    practitioner_role_placer: practitioner_role_placer,
    organization_placer: organization_placer,
    organization_filler: organization_filler
}