/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const Language = require('@google-cloud/language');
const chatApi = require('./chat-api');
const express = require('express');
const cors = require('cors')({origin: true});
var md5 = require('md5');

const app = express();
// const language = new Language({projectId: process.env.GCLOUD_PROJECT});

// admin.initializeApp(functions.config().firebase);

const chatHttpAuth = require('./chat-http-auth');
app.use(chatHttpAuth.authenticate);

const chatSupportApi = require('./chat-support-api');




/**
 * Create a request.
 *
 * This endpoint supports CORS.
 */

app.post('/:app_id/requests', (req, res) => {
  console.log('requests');

   
      if (req.method !== 'POST') {
        res.status(403).send('Forbidden!');
      }
      
      cors(req, res, () => {
        let sender_id = req.user.uid;

        if (!req.body.request_id) {
          res.status(405).send('request_id is not present!');
      }

        if (!req.body.sender_fullname) {
            res.status(405).send('Sender Fullname is not present!');
        }
       
       
        if (!req.body.text) {
            res.status(405).send('text  is not present!');
        }
        if (!req.params.app_id) {
            res.status(405).send('app_id is not present!');
        }

        if (req.body.sender_id) {
          sender_id = req.body.sender_id;
        }

        let request_id = req.body.request_id;

        let sender_fullname = req.body.sender_fullname;
        let recipient_fullname = "Support Group";
        let text = req.body.text;
        let app_id = req.params.app_id;


        console.log('sender_id', sender_id);
        console.log('sender_fullname', sender_fullname);
        console.log('request_id', request_id);
        console.log('recipient_fullname', recipient_fullname);
        console.log('text', text);
        console.log('app_id', app_id);

        let hased_request_id = "support-group-"+md5(request_id);
        console.log('hased_request_id', hased_request_id);

      
        var result =  chatApi.sendGroupMessage(sender_id, sender_fullname, hased_request_id, recipient_fullname, text, app_id);
       

        console.log('result', result);

        res.status(201).send(result);
        // [END sendResponse]
      });
    });

  
 /**
 * Close support group
 
 *
 * This endpoint supports CORS.
 */
// [START trigger]
app.put('/:app_id/groups/:group_id', (req, res) => {
  console.log('close support group');

   
    if (req.method !== 'PUT') {
      res.status(403).send('Forbidden!');
    }
      
      cors(req, res, () => {

        if (!req.params.group_id) {
            res.status(405).send('group_id is not present!');
        }
        if (!req.params.app_id) {
            res.status(405).send('app_id is not present!');
        }

        let group_id = req.params.group_id;
        let app_id = req.params.app_id;


        console.log('group_id', group_id);
        console.log('app_id', app_id);

       
        var result =  chatSupportApi.closeChat(group_id, app_id);

        console.log('result', result);

        res.status(200).send(result);
      });
    });



   


// Expose the API as a function
exports.api = functions.https.onRequest(app);

