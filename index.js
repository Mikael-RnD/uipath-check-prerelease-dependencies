const core = require('@actions/core');
const tc = require('@actions/tool-cache');
var path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const wait = require('./wait');

/*async function findProjectJsonFiles(workspace)
{
  var projectFiles = [];
  console.log('Checking workspace at: ' + workspace);
  var workspacePath = path.resolve(workspace);
  console.log('Workspace path: ' + workspacePath);

  var workspaceContents = fs.readdirSync(workspacePath, function(err,list));
  console.log('Workspace contents: ' + workspaceContents);

  return projectFiles;
}*/

function recFindProjectJson(base,files,result) 
{
  files = files || fs.readdirSync(base) 
  result = result || [] 

  files.forEach( 
      function (file) {
          var newbase = path.join(base,file)
          if ( fs.statSync(newbase).isDirectory() )
          {
            result = recFindProjectJson(newbase,fs.readdirSync(newbase),result);
          }
          else
          {
            if ( path.basename(newbase) == 'project.json' )
            {
              result.push(newbase);
            } 
          }
      }
  )
  return result
}

async function scanForPrereleaseDependency(projectJsonFile)
{
  var hasPrereleaseDependency = false;
  var projectJsonFilePath = path.resolve(projectJsonFile);
  var projectData;
  fetch(projectJsonFilePath).then(response => {
   return response.json();
  }).then(projectData => projectData);
  
  console.log(projectData);
  return hasPrereleaseDependency;
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const workspace = core.getInput('workspace');
    //const projectFiles = await findProjectJsonFiles(workspace);
    var workspacePath = path.resolve(workspace);
    const projectFiles = recFindProjectJson(workspacePath);
    console.log(projectFiles);

    projectFiles.forEach(scanForPrereleaseDependency);
    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
