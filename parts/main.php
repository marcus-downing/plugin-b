<?php

<%= banner %>

namespace <%= namespace %> {
  function plugin_file() {
    return __FILE__;
  }
  function plugin_url($url) {
    return \plugins_url($url, __FILE__);
  }
  function plugin_dir_url() {
    return \plugin_dir_url(__FILE__);
  }
  function plugin_dir_path() {
    return \plugin_dir_path(__FILE__);
  }
  function plugin_basename() {
    return \plugin_basename( __FILE__ );
  }
}

<%= init %>
<%= activation %>
<%= deactivation %>
$loadok = true;
<%= dependencies %>
if ($loadok) {
  spl_autoload_register(function ($class) {
    $path = __DIR__.'/classes/'.trim(str_replace("\\", DIRECTORY_SEPARATOR, $class), DIRECTORY_SEPARATOR).'.class.php';
    if (file_exists($path)) {
      include $path;
    }
  });

  <%= includes %>
  <%= settings %>
  <%= widgets %>
  add_action('init', function () {
    <%= i18n %>
    <%= stylesheets %>
    <%= js %>
  });
}