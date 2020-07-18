#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {clone, add, commit, push} = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const ships = require('culture-ships');
const del = require('del');
const fileName = 'ships.txt';
const dir = path.join(__dirname, 'tmp');
const repoURL = process.argv[2];
const repoUsername = process.argv[3];
const token = process.argv[4];
const author = {name: 'Beep Boop', email: repoUsername};

const go = async function() {
  const message = ships.random();
  try {
    await del(dir);
    await clone({ fs, http, dir, url: repoURL, singleBranch: true, depth: 1 });
    fs.appendFileSync( path.join(__dirname, 'tmp', fileName), `${message}\n` );
    await add({fs, dir, filepath: fileName});
    await commit({fs, dir, message, author});
    await push({ fs, http, dir, remote: 'origin', ref: 'master', onAuth: () => ({ username: token }),});

  } catch (e) {
    console.log( e );
    console.error( 'Commit and push operation failed' );
    return 1;
  }
  console.log( `Commit ${message} pushed` );
};

go();
