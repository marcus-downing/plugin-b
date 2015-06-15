# Plugin b

A small framework for building WordPress plugins with Grunt.

## Introduction

This tool is intended to help you build great WordPress plugins, that follow the guidelines and perform well.
It does this by separating out the sources you edit from the compiled plugin,
and uses Grunt to connect the two.

## Getting started

Install Node.js, NPM and Grunt, using the preferred mechanism for your platform.

Copy the `plugin-template` folder from this repository. Rename it to your plugin's machine name.
It should contain two folders, `src` and `dist`.

```sh
~/plugin-example $ ls
src/   dist/
```

You should only ever edit files in `src`. Initially the `dist` folder should be empty.

### Customise the plugin info

Edit the `package.json` file to set your plugin's name, description, homepage, author details etc.
These details will be directly copied into the plugin's header and used by WordPress.

```json
{
  "name": "fantastic-plugin",
  "title": "My fantastic plugin",
  "description": "A plugin so fantastic you won't believe it",
  "homepage": "http://www.fantastic-plugin.com/",
  "repository": {
    "type": "git",
    "url": "https://github.com/example/fantastic-plugin"
  },
  "private": false,
  "license": "none",
  "version": "1.0.0",
  "author": {
    "name" : "Mr Fantastic",
    "email" : "fan@tast.ic",
    "url" : "http://www.fantastic.com/"
  },
  "dependencies": {
    "grunt": "",
    "plugin-b": "git://github.com/marcusatbang/plugin-b.git#master"
  },
  "namespace": "MrFantastic\\fantastic_plugin"
}
```

You need to keep the two `dependencies`. You can add other dependencies if you wish.

Most of the fields in this file match the Grunt specification. The non-standard ones are:

 * `namespace`: The PHP namespace of all your plugin's classes and functions.

#### Namespaces

Namespaces in PHP should use underscores `_` rather than dashes `-`;
they can use uppercase letters if you wish, provided they're used consistently.
For example, if all your classes follow the pattern `\MyCompany\my_plugin\MyClass`, 
then the plugin's namespace should be `MyCompany\my_plugin`.

The `namespace` field should not include the preceding `\`.
Note that backslashes must be correctly escaped in JSON.

If you choose not to use a PHP namespace for your plugin, don't omit the field.
Instead put this in your `package.json` file:

```json
  "namespace": ""
```

### Install node modules

In the `src` folder of your plugin, run this:

```sh
$ npm install
```

This should fetch all the dependencies you need.

### Run Grunt

In the `src` folder of your plugin, run this:

```sh
$ grunt
```

Or alternatively:

```sh
$ make
```

Either command will build your plugin, putting all the compiled files into the `dist` folder.

You should never need to edit the `Gruntfile.js` or the `Makefile` in your `src`.
The `Makefile` should do nothing but call `grunt` for you; it's there simply as a convenience for systems that don't know anything about Grunt.


## Add plugin parts

### Includes

These PHP files are loaded and processed on every page.
Put include files into the `lib` folder.

`lib/do_stuff.php`

```php
<?php

namespace MrFantastic\fantastic_plugin;

function doStuff() {
  # ...
}
```

The above function will exist in a PHP namespace, so it would be called with:

```php
\MrFantastic\fantastic_plugin\doStuff()
```

Most functions should be within the plugin's namespace, except functions that you wish to be easily accessible from outside code, typically in a file called `api.php`.
See _Coding Conventions_ below for more detail.


### Classes

Classes should be put into the `classes` folder,
in files called _ClassName_`.class.php`.
All your classes should be within the plugin's namespace.

`classes/FantasticClass.class.php`:

```php
<?php

namespace MrFantastic\fantastic_plugin;

class FantasticClass {
  function __construct () {

  }
}
```

Note that, for the sake of autoloading, classes will be put into folders matching the namespace.
For example, the above class would be copied into `dist/MrFantastic/fantastic_plugin/FantasticClass.class.php`.

### Widgets

Widgets behave slightly differently from other classes, in that they get loaded and registered with WordPress.
Widget classes should be put into the `widgets` folder, in files called _WidgetName_`_Widget.class.php`.
All your widget classes should be within the plugin's namespace.

`widgets/Fantastic_Widget.class.php`:

```php
<?php

namespace MrFantastic\fantastic_plugin;

class Fantastic_Widget extends \WP_Widget {
  function __construct() {
    $this->WP_Widget('Fantastic_Widget', 'Fantastic Widget', array(
      'classname' => 'Fantastic_Widget',
      'description' => 'A truly fantastic widget',
    ));
  }
}
```

### LESS / CSS

### JavaScript

### Images

### Settings

### Activation

Code which should be called whenever the plugin

## Coding conventions

Where possible you should follow WordPress' coding standards, with the following exceptions and clarifications.

### Namespaces

You should use a PHP namespace for your plugin.
This helps to disambiguate names, preventing your plugin's functions and classes from clashing with any other plugins or WordPress itself.

Almost every PHP file in your project should begin with an appropriate namespace declaration:

```php
<?php
namespace MrFantastic\fantastic_plugin;
```

### Actions and filters

WordPress plugins are built on a system of hooks:
*actions* are called to give plugins the chance to act at a specific time, 
while *filters* are called to give plugins the chance to change a value.

As well as consuming existing hooks, consider publishing your own to make it possible for other plugins to affect the behaviour of your plugin in safe ways.
For disambiguation, your plugin's hooks should include your namespace separated by colons:

```php
$settings = apply_filters('MrFantastic:fantastic_plugin:settings' $settings);
do_action('MrFantastic:fantastic_plugin:save_settings');
```

When you publish a filter, you should be careful about trusting the value that comes back from it.

When you publish an action relating to an event in your plugin, consider publishing two actions: one `_before` and one `_after`.

```php
do_action('MrFantastic:fantastic_plugin:before_save_settings');
save_settings();
do_action('MrFantastic:fantastic_plugin:after_save_settings');
```