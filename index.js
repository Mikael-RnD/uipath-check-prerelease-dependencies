const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const wait = require('./wait');

async function findProjectJsonFiles()
{
  JSON.parse('')
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const ms = core.getInput('milliseconds');
    core.info(`Waiting ${ms} milliseconds ...`);
    
    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    core.info((new Date()).toTimeString());

    const uipcliPath = await io.which('uipcli', true);
    await exec.exec('"${uipcliPath}"',['--version']);

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
