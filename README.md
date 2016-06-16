# wp-workflow-automation
> Custom gulp task, npm and bower packages for Wordpress automation.

## Getting Started

- [Installation](#installation)
- [Gulp Tasks](#gulp-tasks)
- [Production](#production)
- [License](#license)

## Installation

* On your `wp-content -> themes` directory, clone the repository.
```
$ git clone https://github.com/glennyabellana/wp-automate-workflow.git NAME-OF-THEME-FOLDER
$ cd NAME-OF-THEME-FOLDER
```
* Generate wp starter theme (sassified version) from [UNDERSCORES](http://underscores.me/).
* Extract and copy the files to your working directory `wp-content -> themes -> NAME-OF-THEME-FOLDER`

* Open `Gulpfile.js` and replace the necessary values here:
```
var URL             = 'http://yoursite.com';
var dist_themename  = 'NAME-OF-THEME-FOLDER';
var ftpUploadDir    = '/public_html/path-to-upload-theme-folder/';
var ftpCredentials = {
    host: 'HOST',
    user: 'USER',
    password: 'PASSWORD'
};
/* --End-- */
```

* Run npm and bower to install packages. 
```
$ npm install && bower install
```

**You are now ready to kick-off your custom theme development!**



## Gulp Tasks

**Default task**

Compile SCSS files, minify styles and scripts. Compiled files are saved in `assets` folder.

Run:
```bash
$ gulp
```



**Serve task**

Preview the project on local web server, watch files for changes, reloading the browser automatically via [BrowserSync](https://browsersync.io)

Run:
```
$ gulp serve
```



**Build task**

Build the production-ready files in the `dist` folder. Will have compressed and uncompressed version.

Run:
```
$ gulp build
```



## Production

**Upload Production-ready files**

Upload the build custom theme in the `dist` to the FTP Server.

Run:
```
$ gulp deploy
```




**Delete uploaded files in the server**


Run:
```
$ gulp deploy-clean
```



## License

MIT © Glenny Abellana
