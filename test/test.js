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

    it('should return 20 elements', (done) => {
      agent.get('/api/messages')
      .send()
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        res.body.data.should.be.Array();
        res.body.data.should.have.length(20);
        done();
      });
    });

    it('should return 5 elements between index [42, 46]', (done) => {
      agent.get('/api/messages?offset=42&amount=5')
      .send()
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        res.body.data.should.be.Array();
        res.body.data.should.have.length(5);
        let index = res.body.data[0].mid;
        for (let i = 1; i < 5; i++) {
          res.body.data[i].mid.should.be.below(index);
          index = res.body.data[i].mid;
        }
        done();
      });
    });
  });

  describe('GET /api/messages/:mid', function () {
    it('should return 200 OK', function (done) {
      var mid = '42';
      var message = {
        text: 'Bye, Z Lab Web Application.',
      };
      agent.get('/api/messages/' + mid)
      .send(message)
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('PUT /api/messages/:mid', function () {
    it('should return 200 OK', function (done) {
      var mid = '42';
      var message = {
        text: 'Bye, Z Lab Web Application.',
      };
      agent.put('/api/messages/' + mid)
      .send(message)
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('POST /api/messages/:mid', function () {
    it('should return 200 OK', function (done) {
      var mid = '42';
      agent.delete('/api/messages/' + mid)
      .send()
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
    });
  });
}());
