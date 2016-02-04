Package.describe({
  name: 'des:blockcypher-websocket',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.export('BlockCypherSocket');
  api.addFiles('blockcypher-websocket.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('des:blockcypher-websocket');
  api.addFiles('blockcypher-websocket-tests.js');
});
Npm.depends({websocket: "1.0.19"});