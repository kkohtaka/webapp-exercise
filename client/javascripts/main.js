// Copyright 2016, Z Lab Corporation. All rights reserved.

$ = jQuery = require('jquery');
const bootstrap = require('bootstrap');
const handlebars = require('handlebars');

(() => {
  'use strict';

  const clearMessages = () => {
    $('#message-list-container').empty();
  };

  const refreshMessages = () => {
    clearMessages();

    $.ajax({
      method: 'GET',
      url: '/api/messages'
    }).error(function (err) {
      console.error('error: ', err);
    }).done(function (data) {
      const messageListContainer = $('#message-list-container');
      const messageTemplate = handlebars.compile(
          $('#message-item-template').html());
      const messages = data.data || [];
      const len = messages.length;
      for (let i = 0; i < len; i++) {
        messageListContainer.append(messageTemplate(messages[i]));
      }
    });
  };

  const postMessage = (text) => {
    $.ajax({
      method: 'POST',
      url: '/api/messages',
      data: {
        text: text
      }
    }).error(function (err) {
      console.error('error: ', err);
    }).done(function (data) {
      refreshMessages();
    });
  };

  $(document).ready(() => {
    // Setup UI parts
    $('#post-message-button').on('click', function (ev) {
      ev.preventDefault();
      postMessage($('#message-text-input').val());
      $('#message-form')[0].reset();
    });

    refreshMessages();
  });
})();
