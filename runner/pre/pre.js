'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const async = require('async');
const _ = require('lodash');
const got = require('got');
const FormData = require('form-data');

const ENGINE_API_BASE = 'http://localhost:1337';
const ADMIN_UI_BASE = 'http://localhost:8080';
const BPS_UI_BASE = 'https://localhost:9443';
const CSARS_DIR = '/csars';
const OPENTOSCA_ENDPOINTS_JSON = '/endpoints/opentosca.json';
const ENDPOINTS_JSON = '/endpoints/endpoints.json';
const RETRY_DELAY = 15 * 1000;
const DEPLOY_TIMEOUT = 30 * 60 * 1000;

let csars = [];
let endpoints = {};



async.series([
  function(done) {
    glob(CSARS_DIR + '/*', {
      nodir: true,
      dot: false
    }, (err, files) => {
      if (err) return done(err);

      csars = files;

      console.log('CSARs to be deployed', csars);

      done();
    });
  },
  function(done) {
    console.log('waiting for OpenTOSCA APIs to be available');

    setTimeout(done, RETRY_DELAY);
  },
  function(done) {
    let retries = 0;
    const maxRetries = 12;

    let uiUp = false;
    let apiUp = false;
    let bpsUp = false;

    async.whilst(function() {
      return (!uiUp || !apiUp || !bpsUp) && retries < maxRetries;
    }, function(done) {
      async.series([
        function(done) {
          setTimeout(done, RETRY_DELAY);
        },
        function(done) {
          if (uiUp) return done();

          got(ADMIN_UI_BASE + '/admin/getCSARList.action').then(response => {
            retries++;

            if (response.statusCode !== 200) return done();

            uiUp = true;

            console.log('OpenTOSCA admin UI available');

            done();
          }).catch(err => {
            retries++;

            done();
          });
        },
        function(done) {
          if (apiUp || !uiUp) return done();

          got(ENGINE_API_BASE + '/containerapi/CSARs').then(response => {
            if (response.statusCode !== 200) return done();

            apiUp = true;

            console.log('OpenTOSCA container API available');

            done();
          }).catch(err => {
            done();
          });
        },
        function(done) {
          if (bpsUp || !uiUp || !apiUp) return done();

          got(BPS_UI_BASE + '/carbon/admin/login.jsp', {
            rejectUnauthorized: false
          }).then(response => {
            if (response.statusCode !== 200) return done();

            bpsUp = true;

            console.log('OpenTOSCA BPS available');

            done();
          }).catch(err => {
            done();
          });
        }
      ], done);
    }, (err) => {
      if (err) done(err);
      else if (!uiUp) done(new Error('OpenTOSCA admin UI not available'));
      else if (!apiUp) done(new Error('OpenTOSCA container API not available'));
      else if (!bpsUp) done(new Error('OpenTOSCA BPS not available'));
      else done();
    });
  },
  function(done) {
    console.log('additional delay, required to ensure OpenTOSCA is ready for CSAR deployment');

    setTimeout(done, RETRY_DELAY);
  },
  function(done) {
    async.eachSeries(csars, function(csar, done) {
      console.log('deploying CSAR', csar);

      const form = new FormData();

      // path.basename(csar, '.csar')
      form.append('file', fs.createReadStream(csar));

      got.post(ADMIN_UI_BASE + '/admin/uploadCSAR.action', {
        timeout: DEPLOY_TIMEOUT,
        headers: form.getHeaders(),
        body: form
      }).then(response => {
        done();
      }).catch(err => {
        if (err.response.statusCode !== 302) return done(err);

        console.log('CSAR deployed', csar);

        done();
      });
    }, done);
  },
  function(done) {
    fs.access(OPENTOSCA_ENDPOINTS_JSON, fs.R_OK, (err) => {
      if (err) {
        console.log('cannot find opentosca-endpoints', OPENTOSCA_ENDPOINTS_JSON);

        return done();
      }

      console.log('opentosca-endpoints file found', OPENTOSCA_ENDPOINTS_JSON);

      fs.readFile(OPENTOSCA_ENDPOINTS_JSON, 'utf8', (err, content) => {
        if (err) return done(err);

        _.forEach(_.map(content.trim().split('\n'), JSON.parse), (entry) => {
          if (entry.deployed) endpoints[entry.endpoint] = entry;
        });

        console.log('endpoints consolidated', endpoints);

        done();
      });
    });
  },
  function(done) {
    fs.writeFile(ENDPOINTS_JSON, JSON.stringify(endpoints, null, 2), done);
  }
], (err) => {
  if (err) throw err;
});



// POST http://localhost:8080/admin/uploadCSAR.action
// Content-Type: multipart/form-data, app octet-stream

// GET http://localhost:8080/admin/getCSARList.action
// {"csars":["test-wrapped"],"selectedCSAR":null}

// GET http://docker:8080/admin/getCSARInstanceList.action?selectedCSAR=test-wrapped.csar
// RESPONSE JSON: {"availableInstances":[],"selectedCSAR":"test-wrapped.csar"}

// POST http://localhost:8080/admin/deleteCSAR.action
// HEADER: Content-Type: application/x-www-form-urlencoded
// BODY: form: selectedCSAR=test-wrapped.csar

// GET http://localhost:1337/containerapi/CSARs/moodle2.csar/Content/SELFSERVICE-Metadata/plan.input.default.xml
// ERROR: cannot get file
// ... read from Container API: CSARs/SELFSERVICE-Metadata/data.xml -> reference to planInputFile

// GET http://localhost:8080/vinothek/ApplicationInstantiation?container=localhost&applicationId=http://localhost:1337/containerapi/CSARs/moodle2.csar/Content/SELFSERVICE-Metadata/&optionId=1&xml=%3Csoapenv%3AEnvelope+xmlns%3Asoapenv%3D%22http%3A%2F%2Fschemas.xmlsoap.org%2Fsoap%2Fenvelope%2F%22+xmlns%3Aorg%3D%22http%3A%2F%2F%2Fwww.opentosca.org%2Fexamples%2FMoodle%2FBuildPlan%22%3E%0A+++%3Csoapenv%3AHeader%2F%3E%0A+++%3Csoapenv%3ABody%3E%0A++++++%3Corg%3AMoodleBuildPlanRequest%3E%0A+++++++++%3Corg%3Aregion%3EAWS-REGION-NAME+(e.g.%2C+%22ec2.eu-west-1.amazonaws.com%22)%3C%2Forg%3Aregion%3E%0A+++++++++%3Corg%3AsecurityGroup%3EAWS-SECURITY-GROUP-NAME+(All+TCP+ports+open)%3C%2Forg%3AsecurityGroup%3E%0A+++++++++%3Corg%3AkeyPairName%3EAWS-KEY-PAIR-NAME%3C%2Forg%3AkeyPairName%3E%0A+++++++++%3Corg%3AsshKey%3E-----BEGIN+RSA+PRIVATE+KEY-----%0A...%0AAWS-SSH-KEY%0A(Ensure+that+all+line+breaks+are+conserved+and+no+white+spaces+at+the+beginning+of+the+lines+are+added!)%0A...%0Aabcdefghijklmnopqrstuvwxyz0123456789%3D%3D%0A-----END+RSA+PRIVATE+KEY-----%3C%2Forg%3AsshKey%3E%0A+++++++++%3Corg%3Aami%3EAWS-AMI-ID+(e.g.%2C+%22ami-ce7b6fba%22)%3C%2Forg%3Aami%3E%0A+++++++++%3Corg%3AinstanceType%3Et1.micro%3C%2Forg%3AinstanceType%3E%0A+++++++++%3Corg%3AaccessKey%3EAWS-ACCESS-KEY%3C%2Forg%3AaccessKey%3E%0A+++++++++%3Corg%3AsecretKey%3EAWS-SECRET-KEY%3C%2Forg%3AsecretKey%3E%0A%09%09+%3C!--+Example+for+%25CSAR-NAME%25+%3D+Moodle.csar+--%3E%0A%09%09+%3Corg%3AcsarName%3E%25CSAR-NAME%25%3C%2Forg%3AcsarName%3E%0A%09%09+%3C!--+Example+for+%25CONTAINER-API%25+%3D+http%3A%2F%2F%3CCONTAINER-HOST%3E%3A1337%2Fcontainerapi+--%3E%0A%09%09+%3Corg%3AcontainerApi%3E%25CONTAINER-API%25%3C%2Forg%3AcontainerApi%3E%0A%09%09+%3Corg%3AcallbackUrl%3E%25CALLBACK-URL%25%3C%2Forg%3AcallbackUrl%3E%0A%09%09+%3Corg%3ACorrelationID%3E%25CORRELATION-ID%25%3C%2Forg%3ACorrelationID%3E%0A++++++%3C%2Forg%3AMoodleBuildPlanRequest%3E%0A+++%3C%2Fsoapenv%3ABody%3E%0A%3C%2Fsoapenv%3AEnvelope%3E
/* QUERY STRING PARAMS URL-DECODED:
container=localhost
applicationId=http://localhost:1337/containerapi/CSARs/moodle2.csar/Content/SELFSERVICE-Metadata/
optionId=1
xml=<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:org="http:///www.opentosca.org/examples/Moodle/BuildPlan">
   <soapenv:Header/>
   <soapenv:Body>
      <org:MoodleBuildPlanRequest>
         <org:region>AWS-REGION-NAME (e.g., "ec2.eu-west-1.amazonaws.com")</org:region>
         <org:securityGroup>AWS-SECURITY-GROUP-NAME (All TCP ports open)</org:securityGroup>
         <org:keyPairName>AWS-KEY-PAIR-NAME</org:keyPairName>
         <org:sshKey>-----BEGIN RSA PRIVATE KEY-----
...
AWS-SSH-KEY
(Ensure that all line breaks are conserved and no white spaces at the beginning of the lines are added!)
...
abcdefghijklmnopqrstuvwxyz0123456789==
-----END RSA PRIVATE KEY-----</org:sshKey>
         <org:ami>AWS-AMI-ID (e.g., "ami-ce7b6fba")</org:ami>
         <org:instanceType>t1.micro</org:instanceType>
         <org:accessKey>AWS-ACCESS-KEY</org:accessKey>
         <org:secretKey>AWS-SECRET-KEY</org:secretKey>
		 <!-- Example for %CSAR-NAME% = Moodle.csar -->
		 <org:csarName>%CSAR-NAME%</org:csarName>
		 <!-- Example for %CONTAINER-API% = http://<CONTAINER-HOST>:1337/containerapi -->
		 <org:containerApi>%CONTAINER-API%</org:containerApi>
		 <org:callbackUrl>%CALLBACK-URL%</org:callbackUrl>
		 <org:CorrelationID>%CORRELATION-ID%</org:CorrelationID>
      </org:MoodleBuildPlanRequest>
   </soapenv:Body>
</soapenv:Envelope> */
// RESPONSE STRING: http://localhost:8080/vinothek/CallbackStatus?callbackId=1471439852916

// GET http://localhost:8080/vinothek/CallbackStatus?callbackId=1471439852916
// RESPONSE JSON: {"NO-CALLBACK-RECEIVED-YET":true}
