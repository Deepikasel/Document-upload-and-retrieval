<?php
if (function_exists('mysqli_connect')) {
    echo "✅ MySQLi is working!";
} else {
    echo "❌ MySQLi is NOT working.";
}
?>
