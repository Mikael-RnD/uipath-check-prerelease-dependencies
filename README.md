# UiPath - Find Prerelease Dependencies in UiPath projects
A GitHub Action for finding prerelease dependencies in UiPath project.json files within your repository.

## How to use
Example usage:

      # Set up the UiPath CLI (uipcli) and add it to PATH on your runner
      - name: Setup UiPath (uipcli) command line tool
        uses: Mikael-RnD/uipath-check-prereleas-dependencies@main
        with:
          workspace: #Folder path where the search for project.json file starts. Recursively searches from here. Defaults to GitHub workspace
          errorLevel: # '#error' to trigger error when prerelease dependencies are found. '#warn' for warnings. Default value is '#error'
