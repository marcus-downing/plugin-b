<?php

<%= banner %>

<%= init %>
<%= activation %>

spl_autoload_register(function ($class) {
  $path = __DIR__.'/classes/'.trim(str_replace("\\", DIRECTORY_SEPARATOR, $class), DIRECTORY_SEPARATOR).'.class.php';
  if (file_exists($path)) {
    include $path;
  }
});

<%= includes %>
<%= settings %>
<%= widgets %>

