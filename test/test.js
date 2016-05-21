// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  var app = require('../app');
  const database = require('../models/database');
  var agent = require('supertest').agent(app);
  var should = require('should');

  beforeEach(function (done) {
    database.resetMessagesTable(function () {
      database.insertTestData(done);
    });
  });

  after(function (done) {
    database.resetMessagesTable(done);
  });

  describe('POST /api/messages', function () {
    it('should return 200 OK', function (done) {
      var message = {
        text: 'Hello, Z Lab Web Application.',
      };
      agent.post('/api/messages')
      .send(message)
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('GET /api/messages', function () {
    it('should return 200 OK', function (done) {
      agent.get('/api/messages')
      .send()
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('GET /api/messages/:messageId', function () {
    it('should return 200 OK', function (done) {
      var messageId = '42';
      var message = {
        text: 'Bye, Z Lab Web Application.',
      };
      agent.get('/api/messages/' + messageId)
      .send(message)
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('PUT /api/messages/:messageId', function () {
    it('should return 200 OK', function (done) {
      var messageId = '42';
      var message = {
        text: 'Bye, Z Lab Web Application.',
      };
      agent.put('/api/messages/' + messageId)
      .send(message)
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('POST /api/messages/:messageId', function () {
    it('should return 200 OK', function (done) {
      var messageId = '42';
      agent.delete('/api/messages/' + messageId)
      .send()
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
    });
  });
}());
