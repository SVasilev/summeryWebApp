<?php
  $connection = new mysqli("localhost", "root", "", "summery");

  if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
  }

  $userEmail = htmlspecialchars($_GET["email"]);
  $userPassword = htmlspecialchars($_GET["password"]);

  if ($result = $connection->query("SELECT * FROM user WHERE email='" . $userEmail . "' AND password='" . $userPassword . "'")) {
    if ($result->num_rows) {
      $row = $result->fetch_row();

      session_start();
      $_SESSION["time"] = time();
      $_SESSION["userEmail"] = $row[1];
      $_SESSION["user"] = $row[2] . " " . $row[3];
      echo "Успешно влизане.";
    }
    else echo "Посочените данни са неверни.";
  }
  else {
    $connection->error;
  }

  $connection->close();
?>