#!/usr/bin/env node
const fs = require('fs');
const git = require('nodegit');
const ships = require('culture-ships');


const go = async function() {
  const repo = await git.Clone("https://github.com/ohall/sprinkler", "./tmp");
  fs.writeFileSync('tmp/sprinkler/ships.txt', ships.random(), { flag: 'wx' });
};


go();

