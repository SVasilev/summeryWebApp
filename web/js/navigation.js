/* global $ */

var userData = '';

$(document).ready(function() {
  attachMenuListeners();
  // Load the home page.
  updateContent($('#home')[0]);

  userData = JSON.parse($.ajax({
    type: "GET",
    data: { action: 'getSessionData' },
    url: "../php/session.php",
    async: false
  }).responseText);

  changeLoginPanel();
});

function destroySession() {
  $.ajax({
    type: "GET",
    url: '../php/session.php?action=destroySession',
    success: function(response) {
      if (response === 'deleted') {
        window.location.assign('index.html');
      }
    },
    error: function(response) {
      alert(response.responseText);
    }
  });
}

function changeLoginPanel() {
  if (userData) { // Check if we have session
    $('nav.login_panel').html('Здравейте, ' + userData['userNames'] + ' | <a style="color: blue; text-decoration: underline; cursor: hand;" onclick="return destroySession()">Изход</a>');
  }
}

function attachStarsListeners() {
  $('div').each(function(index, div) {
    var divId = '#' + div.id;
    $(divId + ' .undone').click(function() {
      $(divId).html('<img src="./img/load.gif" />');

      var rating = $(this).attr('rel');
      var userId = divId.substr('#ratingdiv'.length, divId.length);

      $.ajax({
        type: "POST",
        url: "../php/rateSummery.php",
        data: { userId: userId, rating: parseInt(rating) + 1 },
        success: function(msg) {
          var starsNumber = 5;
          var content = '';
          for (var i = 1; i <= starsNumber; i++) {
            content += '<a href="#" class="' + (i <= rating ? 'done' : 'fade') +'" voted>star rated</span>';
          }
          $(divId).html(content);
          setTimeout(function() {
            updateContent($('#review')[0]);
          }, 1000)
        }
      });
    });

    $(divId).on('click', '.voted', function() {
      alert('Вече сте гласували!');
    });
  });
}

function attachMenuListeners() {
  $('nav.menu > a').click(function() {
    // Redirect to login page if we dont have session.
    if ($(this).context.id !== 'home' && !userData) {
      return window.location.assign('login.html');
    }

    $('nav.menu > a').each(function() {
      $(this).removeClass('selected');
      $(this).addClass('not_selected');
    });
    $(this).addClass('selected');
    updateContent($(this).context);
  });
}

function dbQueries(action) {
  if (action === 'setUserChoice') {
    var selectedSummery = "";
    var selected = $("input[type='radio'][name='summery']:checked");
    if (selected.length === 0) { // No checkbox was selected.
      return alert('Моля изберете тема за реферат!');
    }
    else {
      selectedSummery = selected.val();
    }
  }

  var response = $.ajax({
    type: "GET",
    data: { action: action, selectedSummery: selectedSummery },
    url: "../php/dbQueries.php",
    async: false
  }).responseText;
  if (action === 'getAllSummeries' || action === 'getTakenSummeries') {
    response = JSON.parse(response);
  }
  return response;
}

function updateSummeries(dataRows) {
  var content = '';
  var userEmail = userData && userData['userEmail'];
  var userSummery = dbQueries('getUserSummery');
  if (userEmail && userSummery) { // The user is logged in and he already has summery
    content = '<p><b>Вие вече сте избрали своята тема за реферат.</p><p>Вашата тема е: </b><i style="color: green;">' + userSummery + '</i></p>';
  }
  else {
    content ='<form onsubmit="return false;">';
    dataRows.forEach(function(row) {
      content += '<input ' + (row.userMail === 'Admin' ? '' : 'disabled ') + ' type="radio" name="summery" value="' + row.name + '"> ' + row.name + ' <br />';
    });
    content += '<button style="width: 12%;" class="register" onclick="dbQueries(\'setUserChoice\'); alert(\'Темата е успешно избрана!\'); updateContent($(\'#select\')[0]);">Избери</button><br /></form>';
  }
  $('#greeting').before(content);
}

function updateHistoryView(dataRows) {
  var downloadLinks = JSON.parse($.ajax({
    type: "GET",
    url: "../php/uploadsHistory.php",
    async: false
  }).responseText);

  var content = '';
  var index = 1;
  for (var downloadLink in downloadLinks) {
    var uploadDateTime = downloadLinks[downloadLink];
    content += 'Версия ' + index + ': <a href="' + downloadLink + '" download>' + uploadDateTime + '</a> <br />';
    index++;
  }
  content = content || '<p><b>Все още не сте качили версия на своя реферат.</p><p>Можете да качите версия през раздела "Качи реферат".</b></p>';
  $('#congrats').before(content);
}

function updateReviewTable(dataRows) {
  var content = '';

  dataRows.forEach(function(row) {
    content += '<tr>';
    content += '<td>' + row['summeryName'] + '</td>' +
               '<td>' + row['name'] + ' ' + row['family'] + '</td>' +
               '<td>' + (row['score'] ? row['score'] : 'Неоценена') + '</td>' +
               '<td>' + (row["downloadLink"] ? '<a href="' +  row["downloadLink"] + '" download>Изтегли</a>' : 'Не е предаден') +'</td>' +
               '<td>' + (row["downloadLink"] ? '<div id="ratingdiv' + row['id'] + '" class="ratingdiv"><a href="#" class="undone" rel="1">star one</a><a href="#" class="undone" rel="2">star two</a><a href="#" class="undone" rel="3">star three</a><a href="#" class="undone" rel="4">star four</a><a href="#" class="undone" rel="5">star five</a></div>' : '') + '</td></tr>';
  });

  $('table.bordered thead:last').after(content);
}

function updateContent(clickedMenuElement) {
  var menuElementTitle = clickedMenuElement.innerHTML;
  var menuElementId = clickedMenuElement.id;

  var pageContent = {
    home: '<h3>Здравейте</h3><p>Тази уеб апликация представлява система за преглеждане, качване и оценяване на реферати.<p><p>За да можете да работите със системата е необходимо да имате създаден потребител.</p><p>Всеки регистриран потребител играе ролята на студент.</p><p>Всеки студент се регистира и избира тема за реферат. Студентът може да качва различни версии на реферата като се пази история за всяка.</p><h3>На добър път!</h3>',
    select: '<h3>Теми за реферат</h3><p>Тук можете да избирате от свободните теми за вашия реферат. Заетите от вашите колеги теми са маркирани в сиво и не могат да бъдат избирани.</p><p><b>Веднъж избрана темата не може да се променя.</b></p><p>Ако без да искате сте избрали реферат, който не смятате че е правилният избор за вас, моля незабавно пишете мейл до вашият научен ръководител.</p><h3 id="greeting">Приятна работа!</h3>',
    upload: '<h3>Правила за качване</h3><p>Можете да качвате нови версии на рефератът Ви, като можете да преглеждате историята на качванията от секцията "История на качванията".</p><p>Моля имената на файловете да бъдат вашите факултетни номера, а качените файлове да са в един от следните формати (*.doc, *.docx, *.txt). Пример: 80866.doc</p><form name="fileUpload" action="../php/upload.php" method="post" enctype="multipart/form-data"><input type="file" name="fileToUpload" id="fileToUpload"> <br /><p>След като изберете файлът си, моля натиснете бутонът качи файл.</p><input type="submit" value="Качи файл" name="submit"></form>',
    history: '<h3>Хронология</h3><p>Тук можете да откриете пълна хронология на качените от вас версии на рефератът ви. Това е много удобно за възстановяване на изгубени файлове.</p><p>Също така, тук може лесно да се открие с какво е бил подобрен реферата през времето, след нанесениете критики.<h3 id="congrats">Успех!</h3>',
    review: '<h3>Преглеждане на реферати на други студенти</h3><p>Тук можете да видите списък от качените реферати на ваши колеги.</p><p>Всеки качен реферат може да бъде изтеглен, което дава възможност да бъде разглеждан.</p><p>След като сте изтеглили рефератът и сте го прочели, можете да му поставите оценка.</p> <br /><table class="bordered"><thead><tr><th>Име на реферата</th><th>Изготвил</th><th>Оценка</th><th>Действия</th><th>Оцени</th></tr></thead></table><h3>Приятно ревюиране!</h3>'
  };

  $('#section').html(menuElementTitle);
  $('#content').html(pageContent[menuElementId]);

  var dataRows = null;
  if (menuElementId === 'select') {
    dataRows = dbQueries('getAllSummeries');
    updateSummeries(dataRows);
  }

  if (menuElementId === 'upload') {
    if(dbQueries('getUserSummery')) { // The user has already chosen a summery
      $('form[name=fileUpload]').submit(function() {
        if (!$('#fileToUpload').val()) {
          alert('Моля изберете файл.');
          return false;
        }
      });
    }
    else {
      $('form[name=fileUpload]').html('<p><b>Все още не сте си избрали тема за реферат.</p><p>За да го направите, моля посетете секцията "Избор на тема за реферат"</b></p>');
    }
  }

  if (menuElementId === 'history') {
    updateHistoryView();
  }

  if (menuElementId === 'review') {
    dataRows = dbQueries('getTakenSummeries');
    updateReviewTable(dataRows);
    attachStarsListeners();
  }
}
