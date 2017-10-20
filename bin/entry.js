#!/usr/bin/env node

'use strict';

const path = require('path');
const {bundler} = require('@ckeditor/ckeditor5-dev-utils');
const buildConfig = require('../build-config');
const ed = process.env.editor === 'inline' || process.env.editor === 'balloon' ? process.env.editor : 'classic';
const file = 'ck.' + ed + '.js';

bundler.createEntryFile(path.join('src', file), buildConfig);
