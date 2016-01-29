<?php

session_start();
date_default_timezone_set("Europe/Sofia");
$uploadsDir = "../../uploads/" . $_SESSION["userEmail"] . "/";

if (file_exists($uploadsDir)) {
  if ($handle = opendir($uploadsDir)) {
    $fileDownloadLinks = array();
    while (false !== ($entry = readdir($handle))) {
      if ($entry != "." && $entry != "..") {
        $underscoreIndex = strpos($entry, "_");
        $unixTime = substr($entry, 0, $underscoreIndex);
        $fileDownloadLinks[$uploadsDir . $entry] = gmdate("Y-m-d(Time: H:i:s)", $unixTime);
      }
    }
    echo json_encode($fileDownloadLinks);
    closedir($handle);
  }
}
else {
  echo "null";
}

?>