<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $n = $_POST['username'];
    $p = $_POST['password'];
    $c = $_POST['confirmPassword'];

    // Check if passwords match
    if ($p !== $c) {
        echo "Passwords do not match.";
        exit();
    }

    // Connect to database
    $co = mysqli_connect("localhost", "root", "Deepi@1234", "document_verification");

    if (!$co) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Use prepared statements to prevent SQL injection
    $stmt = $co->prepare("INSERT INTO logintable (username1, password1, conformpassword1) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $n, $p, $c);

    if ($stmt->execute()) {
        // Redirect on successful signup
        header("Location: /image.html");
        exit();
    } else {
        echo "Unable to sign up: " . $stmt->error;
    }

    $stmt->close();
    mysqli_close($co);
}
?>
