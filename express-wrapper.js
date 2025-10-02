// Express Wrapper for Fission
// This file wraps Express apps to work with Fission

const express = require('express');
const app = express();

// Import the main server file
require('./server.js');

// Export function for Fission
module.exports = (context) => {
  // Handle HTTP request from Fission
  const { method, url, headers, body } = context.request;
  
  // Create Express request object
  const req = {
    method: method,
    url: url,
    headers: headers,
    body: body,
    query: context.request.query || {},
    params: context.request.params || {}
  };
  
  // Create Express response object
  const res = {
    status: (code) => {
      context.response.status = code;
      return res;
    },
    json: (data) => {
      context.response.body = data;
      context.response.headers['Content-Type'] = 'application/json';
      return res;
    },
    send: (data) => {
      context.response.body = data;
      return res;
    },
    setHeader: (name, value) => {
      context.response.headers[name] = value;
      return res;
    }
  };
  
  // Call Express app
  app(req, res);
  
  return context.response;
};
