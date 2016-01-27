/* global document alert $ */

var loginUtils = { // eslint-disable-line no-unused-vars
  fadeOut: function(elementID, responseText) {
    var statusElement = document.getElementById(elementID);
    var opacity = 1;

    if (statusElement.innerHTML.length < 10) {
      statusElement.innerHTML = responseText;
      var timer = setInterval(function() {
        if (opacity <= 0.1) {
          clearInterval(timer);
          if (responseText === 'Успешно влизане.') {
            clearInterval(timer);
            window.location.assign('./index.html');
          }
          else {
            statusElement.innerHTML = '&nbsp;';
          }
        }
        statusElement.style.opacity = opacity.toString();
        statusElement.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
        opacity -= opacity * 0.2;
      }, 80);
    }
  },

  executeQuery: function(service, parameters) {
    $.ajax({
      url: '../php/' + service + '.php?' + parameters,
      success: function(response) {
        loginUtils.fadeOut('registerStatus', response.toString());
        return;
      },
      error: function(response) {
        alert(response.responseText);
      }
    });
  },

  isEmailValid: function(email) {
    var emailRegularExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegularExpression.test(email);
  },

  register: function() {
    var email = document.getElementById('email')['value'];
    var name = document.getElementById('name')['value'];
    var family = document.getElementById('family')['value'];
    var password = document.getElementById('password')['value'];
    var rePassword = document.getElementById('rePassword')['value'];
    var requestParameters = 'email=' + email + '&name=' + name + '&family=' + family +
                            '&password=' + password + '&rePassword=' + rePassword;

    if (email && name && family && password && rePassword) {
      if (!loginUtils.isEmailValid(email)) {
        loginUtils.fadeOut('registerStatus', 'Невалиден e-mail адрес.');
        return;
      }
      if (password !== rePassword) {
        loginUtils.fadeOut('registerStatus', 'Въведените пароли са различни.');
        return;
      }
      loginUtils.executeQuery('register', requestParameters);
    }
    else {
      loginUtils.fadeOut('registerStatus', 'Моля попълнете всички полета.');
    }
  },

  login: function() {
    var email = document.getElementById('email')['value'];
    var password = document.getElementById('password')['value'];
    var requestParameters = 'email=' + email + '&password=' + password;

    // if (email && password) {
    //   if (!loginUtils.isEmailValid(email)) {
    //     loginUtils.fadeOut('registerStatus', 'Невалиден e-mail адрес.');
    //     return;
    //   }
      loginUtils.executeQuery('login', requestParameters);
    // }
    // else {
    //   loginUtils.fadeOut('registerStatus', 'Моля попълнете всички полета.');
    // }
  }
};
