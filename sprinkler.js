#!/usr/bin/env node
const fs = require('fs');
var path = require('path');
const {Clone, Reference, Signature, Remote, Cred} = require('nodegit');
const ships = require('culture-ships');
const rimraf = require('rimraf');
const fileName = 'ships.txt';
const author = Signature.now('Beep Boop', 'beepn@boop.com');
const committer = Signature.now('Beep Boop', 'beepn@boop.com');
const tmpPath = path.join(__dirname, 'tmp');
const repoURL = process.argv[2];
const repoUsername = process.argv[3];
const repoPassword = process.argv[4];

const go = async function() {
  const msg = ships.random();
  try {
    rimraf.sync(tmpPath);
    const repo = await Clone(repoURL, tmpPath);
    fs.appendFileSync( path.join(__dirname, 'tmp', fileName), `${msg}\n` );
    const index = await repo.refreshIndex();
    await index.addByPath(fileName);
    await index.write();
    const oid = await index.writeTree();
    const head = await Reference.nameToId(repo, 'HEAD');
    const parent = await repo.getCommit(head);
    await repo.createCommit('HEAD', author, committer, msg, oid, [parent]);
    const remote = await Remote.lookup(repo, 'origin');
    const credentials = () => Cred.userpassPlaintextNew(repoUsername, repoPassword);
    await remote.push(['refs/heads/master:refs/heads/master'], { callbacks: { credentials } });
  } catch (e) {
    console.error( 'Commit and push operation failed' );
    console.error( e );
    return 1;
  }
  console.log( `Commit ${msg} pushed` );
};

go();

