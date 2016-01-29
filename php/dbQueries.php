<?php
  session_start();

  $connection = new mysqli("localhost", "root", "", "summery");

  if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
  }
  $connection->query("SET NAMES 'utf8'");

  if (isset($_GET['action']) && !empty($_GET['action'])) {
    $action = $_GET['action'];
    switch ($action) {
      case 'getTakenSummeries':
        getTakenSummeries($connection, TRUE);
        break;
      case 'getAllSummeries':
        getAllSummeries($connection);
        break;
      case 'getUserSummery':
        getUserSummery($connection);
        break;
      case 'setUserChoice':
        setUserChoice($connection);
        break;
    }
  }

  function getAllSummeries($connection) {
    if ($result = $connection->query("SELECT * FROM summeries")) {
      if ($result->num_rows) {
        $resultSet = array();
        while ($row = $result->fetch_assoc()) {
          array_push($resultSet, $row);
        }
        echo json_encode($resultSet);
      }
      else echo "Всички реферати вече са заети.";
    }
    else {
      echo $connection->error;
    }
  }

  function getLatestFileFromUser($currentUserEmail) {
    $uploadsDir = "../../uploads/" . $currentUserEmail . "/";
    if (file_exists($uploadsDir)) {
      if ($handle = opendir($uploadsDir)) {
        $latestFile = NULL;
        while (false !== ($entry = readdir($handle))) {
          if ($entry != "." && $entry != "..") {
            $latestFile = $uploadsDir . $entry;
          }
        }
        return $latestFile;
        closedir($handle);
      }
    }
    return "";
  }

  function getTakenSummeries($connection) {
    $sql = "SELECT id, summeries.name AS summeryName, user.name, user.family, score, email " . "FROM user INNER JOIN summeries ON user.email=summeries.userMail WHERE userMail!='Admin'";
    if ($result = $connection->query($sql)) {
      if ($result->num_rows) {
        $resultSet = array();
        while ($row = $result->fetch_assoc()) {
          $row["downloadLink"] = getLatestFileFromUser($row["email"]);
          array_push($resultSet, $row);
        }
        echo json_encode($resultSet);
      }
      else echo "Всички реферати вече са заети.";
    }
    else {
      echo $connection->error;
    }
  }

  function getUserSummery($connection) {
    $sql = "SELECT * FROM summeries WHERE userMail='" . $_SESSION["userEmail"] . "'";
    if ($result = $connection->query($sql)) {
      if ($result->num_rows) {
        $row = $result->fetch_assoc();
        echo $row["name"];
      }
      else echo "";
    }
    else {
      echo $connection->error;
    }
  }

  function setUserChoice($connection) {
    $sql = "UPDATE summeries SET userMail='" . $_SESSION["userEmail"] . "' WHERE name='" . $_GET['selectedSummery'] . "'";

    if ($connection->query($sql) === TRUE) {
      echo "Record updated successfully";
    } else {
      echo "Error updating record: " . $connection->error;
    }
  }

  $connection->close();
?>