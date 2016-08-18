'use strict';

const fs = require('fs');
const path = require('path');
const async = require('async');
const _ = require('lodash');
const got = require('got');
const FormData = require('form-data');

const ADMIN_UI_BASE = 'http://localhost:8080';
//const CSARS_DIR = '/csars';
//const ENDPOINTS_JSON = '/endpoints/endpoints.json';
const UNDEPLOY_TIMEOUT = 2 * 60 * 1000;

let csars = [];



async.series([
  function(done) {
    got(ADMIN_UI_BASE + '/admin/getCSARList.action', {
      json: true
    }).then(response => {
      csars = response.body.csars;

      console.log('CSARs to be undeployed', csars);

      done();
    }).catch(err => {
      done(err);
    });
  },
  //TODO terminate instances
  // GET http://localhost:8080/admin/getCSARInstanceList.action?selectedCSAR=test-wrapped.csar
  // RESPONSE JSON: {"availableInstances":[],"selectedCSAR":"test-wrapped.csar"}
  function(done) {
    async.eachSeries(csars, function(csar, done) {
      console.log('undeploying CSAR', csar);

      const form = new FormData();

      form.append('selectedCSAR', csar + '.csar');

      got.post(ADMIN_UI_BASE + '/admin/deleteCSAR.action', {
        timeout: UNDEPLOY_TIMEOUT,
        headers: form.getHeaders(),
        body: form
      }).then(response => {
        console.log('CSAR undeployed', csar);

        done();
      }).catch(err => {
        done(err);
      });
    }, done);
  }
], (err) => {
  if (err) throw err;
});
