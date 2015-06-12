<?php

<%= banner %>

<%= activation %>
<%= includes %>

spl_autoload_register(function ($class) {
  $path = __DIR__.'/classes/'.trim(str_replace("\\", DIRECTORY_SEPARATOR, $class), DIRECTORY_SEPARATOR).'.class.php';
  syslog(LOG_NOTICE, "Autoloading class from file: $path");
  if (file_exists($path))
    include $path;
});

<%= widgets %>

