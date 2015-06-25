# Plugin b

A tool for building WordPress plugins using Grunt.

### Not a framework

This tool is intended to help you build great WordPress plugins, that follow the guidelines and perform well.
It does this by separating out the sources you edit from the compiled plugin,
and uses Grunt to connect the two.
It also encourages some coding conventions to ensure plugins are well built.

This is not a framework, at least in the classic sense.
When this tool has worked its magic the resulting plugin is entirely self-contained 
and has no further dependencies on the tool.
It doesn't fill your plugins with lots of useless boilerplate.
Use this tool to help you build lightweight, perfectly formed plugins, not bloated monsters.

### Requirements

Plugin b requires Node.js, and works best on a Unix, Linux or Mac OS platform.
It expects at least PHP 5.3+ and a reasonably recent version of WordPress.

### A note on the use of namespaces

PHP has a namespace problem.
It's not uncommon for two authors to create functions with similar names,
such as `get_css_url`, which won't work together.

There are two traditional solutions to this:
either you prefix all your functions with the same short code, eg `my_plugin_get_css_url()`,
or you put your whole plugin in a single class and methods with `PluginClass::get_css_url()` or `$pluginInstance->get_css_url()`.
Many plugin-authoring guides will tell you to use a class as a container for your plugin,
as a way of keeping your functions separate from the global namespace.
I disagree, because a class is not the same thing as a namespace, even if bits of it are static.
A class should be used for logical elements which may be used multiple times,
and which have connect data and behaviour.
A namespace should be used to group together functions, classes, constants and other things
that need to be isolated to prevent conflicts.

So when building this tool, I opted to use real PHP namespaces.
This does have the effect of requiring you host your sites somewhere that has at least PHP 5.3,
but since that version was released in 2009 and comes with a large number of other improvements
such as anonymous functions, we feel its time is overdue.
If your hosting company doesn't offer you PHP 5.3, urge them to upgrade or find a better place to host.

When writing a plugin against this tool, you are expected to use your namespace throughout.
You are still free to put your plugin in a class if you wish, but not required to.
You should pick a namespace that won't conflict with any other plugins.


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
  "namespace": "MrFantastic\\fantastic_plugin",
  "pluginDependencies": [
    "jetpack"
  ]
}
```

You need to keep the two `dependencies`. You can add other dependencies if you wish.

Most of the fields in this file match the Grunt specification. The non-standard ones are:

 * `namespace`: The PHP namespace of all your plugin's classes and functions.
 * `pluginDependencies`: Any other WordPress plugins that must be loaded for your plugin to work.

If you choose not to use a PHP namespace for your plugin, don't omit the field.
Instead put this in your `package.json` file:

```json
  "namespace": ""
```

Note that backslashes must be correctly escaped as `\\` in JSON.

The `pluginDependencies` list should only be used for plugins that absolutely *must* be loaded
for your plugin to work. If any of these plugins isn't enabled, your plugin will lot load.

### Install node modules

In the `src` folder of your plugin, run this:

```sh
$ make install
```

This should fetch all the dependencies you need.

### Run Grunt

In the `src` folder of your plugin, run this:

```sh
$ make
```

This command will build your plugin, putting all the compiled files into the `dist` folder.

You should never need to edit the `Gruntfile.js` or the `Makefile` in your `src`.
The `Makefile` does nothing but call `grunt` and `npm` for you; it's there simply as a convenience.


## Add plugin parts

### Includes

These PHP files are loaded and processed on every page.
Put include files into the `lib` folder.

`src/lib/do_stuff.php`:

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

There's one special case to consider here. If your project has a file called `init.php` in the `lib` folder, that file will be loaded before anything else in your plugin - even before the activation hooks. This is a place to do essential setup and debugging, but it should *not* presume that activation setup has been done or that other plugins have been loaded.


### Classes

Classes should be put into the `classes` folder,
in files called _ClassName_`.class.php`.
All your classes should be within the plugin's namespace.

`src/classes/FantasticClass.class.php`:

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

`src/widgets/Fantastic_Widget.class.php`:

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

  function form($instance) {
    // widget settings form
  }

  function update($new_instance, $old_instance) {
    // save widget settings
  }
  
  function widget($args, $instance) {
    // draw the widget
  }
}
```

### Stylesheets

Stylesheets should be written in either LESS or SASS.
These stylesheets will be compiled into CSS, combined and optimised for the web.

Create stylesheet files in either `less` or `sass` folders.
There are two special file names:
`main.less` (or `.sass`) is the name of a stylesheet you want to include on public pages,
while `admin.less` (or `.sass`) is the name of a stylesheet you want to appear on admin pages.

...

### JavaScript

Like stylesheets, JavaScript files will be combined and optimised for the web.

...

### Images

WordPress...

### Settings

If your site needs a settings page, call the file `settings.php` and put it in the `lib` folder.

`src/lib/settings.php`:

```php
<h1>My settings page</h1>

<p>...</p>
```

The settings page, unlike other include files, does not need a namespace declaration.

### Activation & deactivation

Occasionally a plugin needs to create database tables, move files or take other special action the moment it's activated.
You should avoid doing this unless it's truly necessary.

Activation code should be placed in the `activate` folder; deactivation code in the `deactivate` folder.

### WordPress Codex

The repository of plugins on wordpress.org

## Coding conventions

Where possible you should follow [the WordPress coding standard](https://make.wordpress.org/core/handbook/coding-standards/php/#naming-conventions),
with the exception of class names noted above and the following clarifications.
You should *not* follow the PEAR naming convention for classes, since it isn't compatible with the _Plugin b_ autoloader.



### Namespaces

You should use a PHP namespace for your plugin.
This helps to disambiguate names, preventing your plugin's functions and classes from clashing with any other plugins or WordPress itself.

Namespaces in PHP should use underscores `_` or camel case rather than dashes `-`.
They can use uppercase letters if you wish, provided they're used consistently.

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

Do not try to use backslashes in action or filter names, as they're unreliable.

### Documentation

Most function, classes and methods don't need documenting, only those you intend to be visible and used by other plugins and themes should be documented.
These should be annotated with standard PHPDoc.