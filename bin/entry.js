#!/usr/bin/env node

'use strict';

const {bundler} = require('@ckeditor/ckeditor5-dev-utils');
const buildConfig = require('../build-config');
const path = require('path');

bundler.createEntryFile(path.join('src', 'ckeditor.js'), buildConfig);
