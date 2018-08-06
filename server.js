'use strict';

const chalk = require('chalk');
const express = require('express');
let app = express();
app.use(require('compression')());
app.use(express.static(__dirname));

window.LiveReloadOptions = { host: 'localhost' };
require('livereload-js');

app.listen(8080, function(err){
	console.log(chalk.green('Server now listening on port 8080'));
})