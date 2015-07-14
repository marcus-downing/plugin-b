<?php
  //  load the settings
  $settings = new <%= settingsClass %>();
  // $option_name = $this->settings_page_properties['option_name'];
  // $option_group = $this->settings_page_properties['option_group'];
  // $settings_data = $this->get_settings_data();
?>
<div class="wrap">
  <?php screen_icon('<%= icon %>'); ?>
  <h2><%= title %></h2>

  <form method="POST" action="">
    <?php settings_fields( $option_group ); ?>
    <?php include 'lib/settings.php'; ?>
  </form>
</div>