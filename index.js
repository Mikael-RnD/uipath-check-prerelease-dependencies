const core = require('@actions/core');
const tc = require('@actions/tool-cache');
var path = require('path');
const fs = require('fs');
const wait = require('./wait');

/*
* Recursively iterates through the base folder path to find any project.json files.
* base = base directory to look in
* files = list of files
* result = list of project.json files
*/
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

function hasPrereleaseDependency(projectJsonFile)
{
  console.log('Scanning: ' + projectJsonFile);
  var projectJsonFilePath = path.resolve(projectJsonFile);
  var projectRawData = fs.readFileSync(projectJsonFilePath);
  var parsedProjectData = JSON.parse(projectRawData);
  
  var dependencies = parsedProjectData['dependencies'];

  Object.entries(dependencies).map(item => {
    console.log(item[0] + ": " + item[1]);
    //core.setFailed(item[1]);
  });

  const projectDependencyInfo = { name: parsedProjectData['name'], hasPrereleaseDependencies: true, dependencies:dependencies}
  return projectDependencyInfo;
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const workspace = core.getInput('workspace');
    const errorLevel = core.getInput('errorLevel');
    //const projectFiles = await findProjectJsonFiles(workspace);
    var workspacePath = path.resolve(workspace);
    const projectFiles = recFindProjectJson(workspacePath);
    console.log(projectFiles);
    
    var projectsWithPrereleaseDependencies = [];
    projectFiles.forEach(project => {
      var projectDependencyInfo = hasPrereleaseDependency(project);
      if(projectDependencyInfo['hasPrereleaseDependencies'] == true) {
        projectsWithPrereleaseDependencies.push(projectDependencyInfo);
      }
    });

    if(projectsWithPrereleaseDependencies.length > 0 && errorLevel == '#error') {
      core.setFailed(JSON.stringify(projectsWithPrereleaseDependencies));
    } else if(projectsWithPrereleaseDependencies.length > 0 && errorLevel == '#warn'){
      core.notice();
    } else {
      console.log('No prerelease dependencies were found.');
    }

    console.log(projectsWithPrereleaseDependencies);

    //projectFiles.forEach(hasPrereleaseDependency);
    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
