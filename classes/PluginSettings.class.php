<?php

namespace Plugin_b;

abstract class PluginSettings implements ArrayAccess {
  protected $settings;

  public static function get() {
    static $instance;
    if (!isset($instance)) {
      $class = get_called_class();
      $instance = new $class();
      $instance->load();
    }
    return $instance;
  }

  public function __construct() {
    $settings = get_option($this->optionName());
    if (empty($settings)) $settings = array();

    $defaults = $this->defaults();
    if (empty($defaults)) $defaults = array();

    $settings = wp_parse_args((array) $settings, (array) $defaults);
    $settings = array_intersect_key($settings, $defaults);
    $settings = (array) apply_filters($this->_hookPrefix.':get_settings', $settings);
    $settings = array_intersect_key($settings, $defaults);
    $this->settings = $settings;
  }

  public final function __get($name) {
    return isset($this->settings[$offset]) ? $this->settings[$offset] : null;
  }

  public final function __set($name, $value) {
    if (isset($this->settings[$name]))
      $this->settings[$name] = $value;
  }

  public function offsetSet($offset, $value) {
    if (isset($this->settings[$offset]))
      $this->settings[$offset] = $value;
  }

  public function offsetExists($offset) {
    return isset($this->settings[$offset]);
  }

  public function offsetUnset($offset) {
    unset($this->settings[$offset]);
  }

  public function offsetGet($offset) {
    // if (is_callable($this->settings[$offset])){
    //   return call_user_func($this->settings[$offset], $this);
    // }
    return isset($this->settings[$offset]) ? $this->settings[$offset] : null;
  }

  abstract public function defaults();

  public function optionName() {
    $className = get_class($this);
    return str_replace('\\', ':', $className);
  }

  private final function _hookPrefix() {
    $className = get_class($this);
    if ($pos = strrpos($className, '\\'))
      $ns = substr($className, 0, $pos);
    else
      $ns = $className;
    return trim(str_replace('\\', ':', $ns), ':');
  }

  public function save() {
    $defaults = $this->defaults();
    if (empty($defaults)) $defaults = array();

    $settings = apply_filters($this->_hookPrefix.':save_settings', $this->settings);
    $settings = wp_parse_args((array) $settings, (array) $defaults);
    $settings = array_intersect_key($settings, $defaults);
    set_option($this->optionName(), $settings);
  }
}