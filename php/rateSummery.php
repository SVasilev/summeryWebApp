<?php
  sleep(1);
  $connection = new mysqli("localhost", "root", "", "summery");

  if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
  }
  $connection->query("SET NAMES 'utf8'");

  if ($result = $connection->query("SELECT score FROM user INNER JOIN summeries ON user.email=summeries.userMail WHERE id=" . $_POST["userId"])) {
    while ($row = $result->fetch_assoc()) {
      $newRating = $row["score"] ? (($row["score"] + $_POST["rating"]) / 2) : $_POST["rating"];
      $connection->query("UPDATE user INNER JOIN summeries ON user.email=summeries.userMail SET summeries.score=" . $newRating ." WHERE user.id=" . $_POST["userId"]);
      break;
    }
  }
  else {
    echo $connection->error;
  }
?>

