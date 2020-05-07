# ToDos for Project

- Screenshot of TravisCI which shows the successful build and deploy steps
- The public GitHub repo and the docker hub images
- Screenshot of kubectl get pod which shows all running containers
- Screenshot of the application
- [Also see the Project Rubric](https://review.udacity.com/#!/rubrics/2572/view)

# Branches

For this project, we are using the following branching conventions:

- **dev** is the development branch. To work on anything, please create your own branch named `<type>/<name>` where
 `<type>` is one of these:
    - `feature` for any feature work
    - `fix` for any bug fix
    - `junk` for any throwaway branch to experiment with  
  
  and `<name>` is the actual name, e.g.: `feature/add-logout`
  
- **staging** is our testing branch. The staging environment is accessible for QA and the other teams, so that they can
review and (manually) test our changes there if necessary. 

- **master** is our production branch. What goes in there needs to be production ready. The branch is protected, so it is
not possible to commit directly against this branch. Use pull requests (PRs) from staging instead.
