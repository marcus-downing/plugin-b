<?php

<%= banner %>

define('<%= namespace %>\\PLUGIN_FILE', __FILE__);

$loadok = true;
if (version_compare(PHP_VERSION, '5.3', '<')) {
  $loadok = false;

  function <%= namespaced_end_fn %>() {
    echo '<div class=\"error\"><p>'.__('<%= pkg.title %> requires PHP 5.3 to function properly. Please upgrade PHP. The plugin has been deactivated.', '<%= pkg.name %>').'</p></div>';
    if ( isset( $_GET['activate'] ) ) 
      unset( $_GET['activate'] );
  }

  add_action('admin_notices', '<%= namespaced_end_fn %>');
  return;
}
<%= dependencies %>

if ($loadok) {
  require 'load.php';
} else {
  add_action( 'admin_init', create_function('', "
    deactivate_plugins( plugin_basename( __FILE__ ) )
    ") );
}