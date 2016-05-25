// Copyright 2016, Z Lab Corporation. All rights reserved.

$ = jQuery = require('jquery');
require('waypoints/lib/jquery.waypoints');
const bootstrap = require('bootstrap');
const handlebars = require('handlebars');
const moment = require('moment');

(() => {
  'use strict';

  moment().locale('en');

  let messageLength = 0;

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

    // NOTE: Make uneditable if a user clicked outside of the item.
    $(document).mouseup((ev) => {
      if (!target.is(ev.target) && target.has(ev.target).length === 0) {
        $(document).off('mouseup');
        makeMessageUneditable(target);
      }
    })
    messageUpdateButton.click((ev) => {
      ev.preventDefault();
      updateMessage(mid, messageInput.val(), target);
    });
    messageInput.focus();
  };

  const messageListContainer = $('#message-list-container');
  const clearMessages = () => {
    console.log('clearMessages');
    messageListContainer.empty();
    messageLength = 0;
  };
  const appendMessage = (messageItem) => {
    console.log('appendMessage');
    messageListContainer.append(messageItem);
    messageLength++;
  };

  let loading = false;
  const loadMoreMessages = () => {
    console.log('loadMoreMessages');
    if (loading) {
      console.log('loadMoreMessages was called while loading');
      return;
    }
    loading = true;
    $.ajax({
      method: 'GET',
      url: '/api/messages?offset=' + messageLength,
    }).error(function (err) {
      console.error('error: ', err);
      loading = false;
    }).done(function (data) {
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
        appendMessage(messageItem);
      }
      loading = false;
    });
  };
  const waypoints = new Waypoint({
    element: messageListContainer[0],
    handler: (direction) => {
      if (direction === 'down') {
        loadMoreMessages();
      }
    },
  });

  const refreshMessages = () => {
    console.log('refreshMessages');
    clearMessages();
    loadMoreMessages();
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
      if (err.status === 401) {
        $('#alert-modal').modal();
      }
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
      if (err.status === 401) {
        $('#alert-modal').modal();
      }
      const input = target.find('.message-update-text-input');
      input.val(input.data('default'));
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
