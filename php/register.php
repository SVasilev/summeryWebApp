<?php
  $connection = new mysqli("localhost", "root", "", "summery");

  if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
  }

  $userEmail = htmlspecialchars($_GET["email"]);
  $userName = htmlspecialchars($_GET["name"]);
  $userFamily = htmlspecialchars($_GET["family"]);
  $userPassword = htmlspecialchars($_GET["password"]);

  if ($result = $connection->query("SELECT * FROM user WHERE email='" . $userEmail . "'")) {
    if ($result->num_rows) echo "Посоченият e-mail вече е зает.";
    else {
      $connection->query("INSERT INTO user(email, name, family, password)" .
                         "VALUES('" . $userEmail . "', '" . $userName . "'," .
                         "'" . $userFamily . "', '" . $userPassword . "')");
      echo "Регистрацията е успешна.";
    }
  }

  $connection->close();
?>