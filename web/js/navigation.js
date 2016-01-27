/* global $ */

$(document).ready(function() {
  attachMenuListeners();
  // Load the home page.
  changeContent($('#home')[0]);
});

function addTableForReview() {
  $('table.bordered thead:last').after('<tr><td>Селскостопански мотиви</td><td>Антонио Николов</td><td>4.78</td><td><a href="./index.html" download>Изтегли</a></td><td><div id="ratingdiv"><a href="#" class="undone" rel="1">star one</a><a href="#" class="undone" rel="2">star two</a><a href="#" class="undone" rel="3">star three</a><a href="#" class="undone" rel="4">star four</a><a href="#" class="undone" rel="5">star five</a></div></td></tr>');
}

function attachStarsListeners() {
  $('#ratingdiv .undone').click(function() {
    var div = '#ratingdiv';
    $(div).html('<img src="./img/load.gif" />');
    var postdata = "rate=" + $(this).attr('rel');

    $.ajax({
      type: "POST",
      url: "rate.php",
      data: postdata,
      success: function(msg) {
        $(div).html(msg);
      }
    });
  });

  $('#ratingdiv .voted').live('click', function() {
    alert('Already Done!');
  });
}

function attachMenuListeners() {
  $('nav.menu > a').click(function() {
    /*
      Check if logged in. PHP
    */

    $('nav.menu > a').each(function() {
      $(this).removeClass('selected');
      $(this).addClass('not_selected');
    });
    $(this).addClass('selected');
    changeContent($(this).context);
  });
}

function changeContent(clickedMenuElement) {
  var menuElementTitle = clickedMenuElement.innerHTML;
  var menuElementId = clickedMenuElement.id;

  var pageContent = {
    home: '<h3>Здравейте</h3><p>Тази уеб апликация представлява система за преглеждане, качване и оценяване на реферати.<p><p>За да можете да работите със системата е необходимо да имате създаден потребител.</p><p>Всеки регистриран потребител играе ролята на студент.</p><p>Всеки студент се регистира и избира тема за реферат. Студентът може да качва различни версии на реферата като се пази история за всяка.</p><h3>На добър път!</h3>',
    select: '<h3>Теми за реферат</h3><p>Тук можете да избирате от свободните теми за вашия реферат. Заетите от вашите колеги теми са маркирани в сиво и не могат да бъдат избирани.</p><p><b>Веднъж избрана темата не може да се променя.</b></p><p>Ако без да искате сте избрали реферат, който не смятате че е правилният избор за вас, моля незабавно пишете мейл до вашият научен ръководител.</p><form action="chooseSummery.php"><input type="radio" name="gender" value="male"> Male <br /><input type="radio" name="gender" value="female" disabled> Female <br /><input type="radio" name="gender" value="other"> Other <br /> <br /><input type="submit" value="Избери"></form><h3>Приятна работа!</h3>',
    upload: '<h3>Правила за качване</h3><p>Можете да качвате нови версии на рефератът Ви, като можете да преглеждате историята на качванията от секцията "История на качванията".</p><p>Моля имената на файловете да бъдат вашите факултетни номера, а качените файлове да са в един от следните формати (*.doc, *.docx, *.txt). Пример: 80866.doc</p><form action="upload.php" method="post" enctype="multipart/form-data"><input type="file" name="fileToUpload" id="fileToUpload"> <br /><p>След като изберете файлът си, моля натиснете бутонът качи файл.</p><input type="submit" value="Качи файл" name="submit"></form>',
    history: 'Този фичър може и да не остане време да се имплементира !!!',
    review: '<h3>Преглеждане на реферати на други студенти</h3><p>Тук можете да видите списък от качените реферати на ваши колеги.</p><p>Всеки качен реферат може да бъде изтеглен, което дава възможност да бъде разглеждан.</p><p>След като сте изтеглили рефератът и сте го прочели, можете да му поставите оценка.</p> <br /><table class="bordered"><thead><tr><th>Име на реферата</th><th>Изготвил</th><th>Оценка</th><th>Действия</th><th>Оцени</th></tr></thead></table><h3>Приятно ревюиране!</h3>'
  };

  $('#section').html(menuElementTitle);
  $('#content').html(pageContent[menuElementId]);

  if (menuElementId === 'review' /* && table is empty */) { // No need to make requests every time.
    addTableForReview();
    attachStarsListeners();
  }
}
