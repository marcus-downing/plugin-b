<?php

<%= banner %>

<%= activation %>
<%= includes %>

spl_autoload_register(function ($class) {
  $class = str_replace("\\", "/", $class);
  @include_once 'classes/'.$class.'.class.php';
});

