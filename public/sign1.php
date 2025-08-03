<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Database connection
    $conn = mysqli_connect("localhost", "root", "Deepi@1234", "document_verification");

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Check if username already exists
    $stmt = $conn->prepare("SELECT username2 FROM login1table WHERE username2 = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "<script>alert('Username already exists. Try a different one!'); window.history.back();</script>";
    } else {
        // Insert new user
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO login1table (username2, password2) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $hashed_password);

        if ($stmt->execute()) {
            echo "<script>alert('Signup successful! You can now login.'); window.location.href='login.html';</script>";
        } else {
            echo "Error: " . $stmt->error;
        }
    }

    $stmt->close();
    mysqli_close($conn);
}
?>
