#!/usr/bin/env node
const fs = require('fs');
const process = require('process');
const path = require('path');
const { loadConfig } = require('use-config-json');
const sharp = require('sharp');

const defaultConfig = {
  'ISDIR': true,
  'DIR_OR_FILE': null
};

const supportedFiles = [
  '.svg',
  '.jpg',
  '.jpeg',
  '.ico'
];

let config = loadConfig(defaultConfig);

/**
  Ignore default config
**/
if ((!config.DIR_OR_FILE) && process.argv.length !== 3) {
  throw new Error('Please check your config!');
}

if (!config.DIR_OR_FILE && process.argv[2]) {
  config.DIR_OR_FILE = process.argv[2];
}

if (supportedFiles.includes(path.extname(config.DIR_OR_FILE))) {
  config.ISDIR = false;
}

const convert = async (file) => {
  try {
    sharp(file).png().toFile(`${path.parse(file).name}.png`);
  } catch (e) {
    console.error(`Failed to convert ${file} to PNG`);
    console.error(e);
  }
};

const start = () => {
  if (config.ISDIR === true) {
    try {
      const files = fs.readdirSync(config.DIR_OR_FILE, { encoding: 'utf8' }).filter(f => supportedFiles.includes(path.extname(f)) === true);
      files.map(f => convert(f));
    } catch (e) {
      console.error('Error while reading files');
      console.error(e);
    }
  } else {
    convert(path.join(process.cwd(), config.DIR_OR_FILE));
  }
};

start();
