
<?php
require_once 'validators.php';
require_once 'connect_to_db.php';
login();
function login() {
  //$_SESSION['data'] = $_POST['data'];
  if (!empty($_POST['email'].$_POST['password'])) {
    # Sanitize email and password (for PHP, not SQL).
    global $mysqli;
    $email = htmlspecialchars($_POST['email']);
    $password = htmlspecialchars($_POST['password']);
    $email = $mysqli->real_escape_string($email);
    $password = $mysqli->real_escape_string($password);
    if (!emailIsValid($email) || !passwordIsValid($password))
      return 'Server-side validation failed.<br><br>';
    $password_hash = hash('sha256', $password);
    if ($mysqli->connect_error)
      return 'Database connection failed.<br><br>';
    $stmt = $mysqli->prepare('SELECT * FROM users WHERE email = ?
                              AND password_hash = ?');
    $stmt->bind_param('ss', $email, $password_hash);
    $stmt->execute();
    $stmt_result = $stmt->get_result();
    # If no users are found, then the credentials are incorrect.
    if ($stmt_result->num_rows <= 0)
      return 'Invalid email-password combination.<br><br>';
    $user = $stmt_result->fetch_row();
    # Store the user's info in a PHP session.
    if(session_status() == PHP_SESSION_NONE)
      session_start();
    $_SESSION['user_id'] = $user[0];
    $_SESSION['user_name'] = $user[1];
    $_SESSION['user_email'] = $user[2];
    $_SESSION['user_category'] = $user[4];
    //header('Location: ../restaurants.php');
    $stmt->close();
    $mysqli->close();
    return 'Success.<br><br>';
  }
}
