const core = require('@actions/core');
const tc = require('@actions/tool-cache');
var path = require('path');
const fs = require('fs');

const wait = require('./wait');

async function findProjectJsonFiles(workspace)
{
  console.log('Checking workspace at: ' + workspace);
  const workspacePath = path.format(workspace);
  console.log(workspacePath);
  const workspaceContents = fs.readdirSync(workspacePath);
  console.log(workspaceContents);
}

async function scanForPrereleaseDependency()
{

}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const workspace = core.getInput('workspace');
    const projectFiles = await findProjectJsonFiles(workspace);
    projectFiles.forEach(scanForPrereleaseDependency);
    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
