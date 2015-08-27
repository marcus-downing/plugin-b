<?php

namespace <%= namespace %>;

function plugin_file() { return PLUGIN_FILE; }
function plugin_url($url) { return \plugins_url($url, PLUGIN_FILE); }
function plugin_dir_url() { return \plugin_dir_url(PLUGIN_FILE); }
function plugin_dir_path() { return \plugin_dir_path(PLUGIN_FILE); }
function plugin_basename() { return \plugin_basename( PLUGIN_FILE ); }

function plugin_settings_url() { return \admin_url('<%= settingspage %>'); }
function plugin_css_url() { return plugin_url('css'); }
function plugin_js_url() { return plugin_url('js'); }
function plugin_images_url() { return plugin_url('images'); }

function plugin_css_dir() { return plugin_dir_path().'/classes'; }
function plugin_js_dir() { return plugin_dir_path().'/classes'; }
function plugin_classes_dir() { return plugin_dir_path().'/classes'; }
function plugin_lib_dir() { return plugin_dir_path().'/lib'; }
function plugin_widgets_dir() { return plugin_dir_path().'/widgets'; }
function plugin_languages_dir() { return plugin_dir_path().'/languages'; }

function plugin_namespace($name) { return __NAMESPACE__.'\\'.$name; }
function plugin_namespace_function($name) { return __NAMESPACE__.'\\'.$name; }
function plugin_namespace_hook($name) { return "<%= hookbase %>:$name"; }

<%= boot %>
<%= activation %>
<%= deactivation %>

spl_autoload_register(function ($class) {
  $path = plugin_classes_dir().'/'.trim(str_replace("\\", DIRECTORY_SEPARATOR, $class), DIRECTORY_SEPARATOR).'.class.php';
  if (file_exists($path)) {
    include $path;
  }
});

<%= includes %>
<%= settings %>
<%= widgets %>
<%= load %>
add_action('init', function () {
  <%= i18n %>
  <%= stylesheets %>
  <%= js %>
  <%= init %>
});