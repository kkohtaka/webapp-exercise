// Copyright 2016, Z Lab Corporation. All rights reserved.

$ = jQuery = require('jquery');
const bootstrap = require('bootstrap');
const handlebars = require('handlebars');
const moment = require('moment');

(() => {
  'use strict';

  moment().locale('en');

  const formatDate = (date) => {
    return moment(date).format('ddd, MMM Do YYYY, hh:mm:ss');
  };

  const makeMessageUneditable = (target) => {
    console.log('makeMessageUneditable');
    const mid = target.find('input.message-update-id-input').val();
    const text = target.find('input.message-update-text-input').val();
    const messageTextTemplate = handlebars.compile(
        $('#message-text-template').html());
    const messageText = messageTextTemplate({
      mid: mid,
      text: text,
    });
    target.html(messageText);

    target.click((ev) => {
      console.log('click');
      makeMessageEditable(target);
    });
  };

  const makeMessageEditable = (target) => {
    console.log('makeMessageEditable');
    target.off('click');

    const mid = target.find('input.message-update-id-input').val();
    const text = target.find('input.message-update-text-input').val();
    const messageUpdateFormTemplate = handlebars.compile(
        $('#message-update-form-template').html());
    const messageUpdateForm = messageUpdateFormTemplate({
      mid: mid,
      text: text,
    });
    target.html(messageUpdateForm);
    const messageInput = target.find('input.message-update-text-input');
    const messageUpdateButton = target.find('button.message-update-button');

    messageInput.blur((ev) => {
      makeMessageUneditable(target);
    });
    messageUpdateButton.click((ev) => {
      ev.preventDefault();
      updateMessage(mid, messageInput.val(), target);
    });
    messageInput.focus();
  };

  const clearMessages = () => {
    console.log('clearMessages');
    $('#message-list-container').empty();
  };

  const refreshMessages = () => {
    console.log('refreshMessages');
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
        const message = messages[i];
        message.created = formatDate(message.created);
        const messageItem = $(messageTemplate(messages[i]));
        const messageText = $(messageItem).find('.message-text');
        const messageTextTemplate = handlebars.compile(
            $('#message-text-template').html());
        messageText.html(messageTextTemplate(message));
        messageText.click((ev) => {
          console.log('click');
          makeMessageEditable(messageText);
        });
        messageListContainer.append(messageItem);
      }
    });
  };

  const postMessage = (text) => {
    console.log('postMessage');
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

  const updateMessage = (mid, text, target) => {
    console.log('updateMessage', mid, text);
    $.ajax({
      method: 'PUT',
      url: '/api/messages/' + mid,
      data: {
        text: text
      }
    }).error(function (err) {
      console.error('error: ', err);
    }).done(function (data) {
      makeMessageUneditable(target);
    });
  };

  $(document).ready(() => {
    // Setup UI parts
    $('#post-message-button').click((ev) => {
      ev.preventDefault();
      postMessage($('#message-text-input').val());
      $('#message-form')[0].reset();
    });

    refreshMessages();
  });
})();
