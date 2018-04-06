#!/usr/bin/env node

'use strict';

const {bundler} = require('@ckeditor/ckeditor5-dev-utils');
const buildConfig = require('../build-config');
const path = require('path');
const file = 'ck.' + process.env.editor + '.js';

bundler.createEntryFile(path.join('src', file), buildConfig);
