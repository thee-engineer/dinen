<?php
  session_start();
  require_once 'php_scripts/restrict_access.php';
  # Redirect non-managers to the login page.
  restrict_access(UserType::MANAGER);
?>
<!DOCTYPE html>
<html>
<head>
  <?php require_once 'common/head.php'; ?>
  <title>Dinen Login</title>
</head>
<body>
  <?php require_once 'common/navbar.php'; ?>
  <div class = 'container'>
    <?php
      $name = $_SESSION['name'];
      echo 'Hello, $name. Restaurants you own:';
      require_once 'php_scripts/get_restaurants.php'; echo getRestaurants();
    ?>
  </div>
</body>
</html>