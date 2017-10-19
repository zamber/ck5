#!/usr/bin/env node

'use strict';

const path = require('path');
const {bundler} = require('@ckeditor/ckeditor5-dev-utils');
const buildConfig = require('../build-config');

bundler.createEntryFile(path.join('src', 'ckeditor.js'), buildConfig);
