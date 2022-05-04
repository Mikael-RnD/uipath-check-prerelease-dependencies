# UiPath - Find Prerelease Dependencies in UiPath projects
A GitHub Action for finding prerelease dependencies in UiPath project.json files within your repository.

## How to use
Example usage:

      # Scan project.json files for beta or alpha dependencies.
      - name: Scan For Prerelease Dependencies
        uses: Mikael-RnD/uipath-check-prerelease-dependencies@main
        with:
          workspace: #Folder path where the search for project.json file starts. Recursively searches from here. Defaults to GitHub workspace
          errorLevel: # '#error' to trigger error when prerelease dependencies are found. '#warn' for warnings. Default value is '#error'
