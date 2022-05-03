const core = require('@actions/core');
var path = require('path');
const fs = require('fs');

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
    
    var libraryVersion = item[1];
    
    console.log(libraryVersion);
  });

  const projectDependencyInfo = { name: parsedProjectData['name'], hasPrereleaseDependencies: true, prereleaseDependencies:dependencies}
  return projectDependencyInfo;
}

function setErrorMessage(projectsWithPrereleaseDependencies) {
  console.log('Setting error message.');
  var errorMessage ='';
  projectsWithPrereleaseDependencies.forEach(project => {
    errorMessage.concat(errorMessage, '\n','--------------------------------------------');
    errorMessage.concat(errorMessage,'\n','The project:' + project['name'] + ' has the following prerelease dependencies: ');
    Object.entries(project['prereleaseDependencies']).map(item => {
      errorMessage.concat(errorMessage,'\n', item[0] + ":" + item[1]);
    });
    errorMessage.concat(errorMessage,'\n', '--------------------------------------------');
  });
  console.warn(errorMessage);
  return errorMessage;
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const workspace = core.getInput('workspace');
    const errorLevel = core.getInput('errorLevel');
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

    if(projectsWithPrereleaseDependencies.length > 0) {
      var errorMessage = setErrorMessage(projectsWithPrereleaseDependencies);
      console.log(projectsWithPrereleaseDependencies);
      if(errorLevel == '#warn'){
        core.warning(projectsWithPrereleaseDependencies);
      }
      if(errorLevel == '#error') {
        core.setFailed(projectsWithPrereleaseDependencies);
      }
    } else {
      console.log('No prerelease dependencies were found.');
    }

    //console.log(projectsWithPrereleaseDependencies);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
