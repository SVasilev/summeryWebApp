<?php

session_start();
date_default_timezone_set("Europe/Ljubljana");

$uploadsDir = "../../uploads/";
if (!file_exists($uploadsDir)) {
  mkdir($uploadsDir, 0777, true);
}

$targetDir = $uploadsDir . $_SESSION["userEmail"] . "/";
if (!file_exists($targetDir)) {
  mkdir($targetDir, 0777, true);
}

$targetFile = $targetDir . basename(time() . "_" .$_FILES["fileToUpload"]["name"]);
$fileType = pathinfo($targetFile, PATHINFO_EXTENSION);
$uploadOk = TRUE;

function redirect() {
  echo "<br /> Redirecting to app...";
  header("Refresh: 2; URL=../web/index.html");
}

// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
  echo "Upload failed. File is too big!";
  $uploadOk = FALSE;
}
// Allow certain file formats
if ($fileType != "doc" && $fileType != "docx" && $fileType != "txt" && $fileType != "pdf") {
  echo "Upload failed. Only *.pdf, *.doc, *.docx, *.txt. files are allowed.";
  $uploadOk = FALSE;
}

if ($uploadOk === TRUE) {
  if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFile)) {
    echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
    redirect();
  } else {
    echo "Sorry, there was an error uploading your file.";
    redirect();
  }
}
else {
  redirect();
}


?>