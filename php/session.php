<?php
  session_start();

  if (isset($_GET['action']) && !empty($_GET['action'])) {
    $action = $_GET['action'];
    switch ($action) {
      case 'getSessionData':
        getSessionData();
        break;
      case 'destroySession':
        destroySession();
        break;
    }
  }

  function getSessionData() {
    if (array_key_exists("user", $_SESSION)) {
      echo json_encode(array("userNames" => $_SESSION["user"], "userEmail" => $_SESSION["userEmail"]));
    }
    else {
      echo "null";
    }
  }

  function destroySession() {
    session_destroy();
    echo "deleted";
  }
?>