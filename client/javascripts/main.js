// Copyright 2016, Z Lab Corporation. All rights reserved.

(function () {
  $ = jQuery = require('jquery');
  var bootstrap = require('bootstrap');
  var handlebars = require('handlebars');

  function clearMessages () {
    $('#message-list-container').empty();
  }

  function refreshMessages () {
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
  }

  function postMessage(text) {
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
  }

  $(document).ready(function () {
    // Setup UI parts
    $('#post-message-button').on('click', function (ev) {
      postMessage($('#message-text-input').val());
    });

    refreshMessages();
  });
}());
