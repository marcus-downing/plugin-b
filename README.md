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

### Customise the template

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

This should build your plugin, putting all the compiled files into the `dist` folder.

You do not need to edit the `Gruntfile.js` in your `src`.