include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

$inactivePlugins = array();
foreach (array(<%= deps %>) as $dep) {
  if (!is_plugin_active($dep)) {
    $inactivePlugins[] = $dep;
    $loadok = false;
  }
}
if (!empty($inactivePlugins)) {
  if (is_admin()) {
    
  }
}