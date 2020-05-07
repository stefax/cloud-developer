##### The Udagram Project

# ToDos

- Screenshot of TravisCI which shows the successful build and deploy steps
- The public GitHub repo and the docker hub images
- Screenshot of kubectl get pod which shows all running containers
- Screenshot of the application
- [Also see the Project Rubric](https://review.udacity.com/#!/rubrics/2572/view)


# Setup

The project has four folders: 
- **restapi-user:** is the rest api to authenticate the user
- **restapi-feed:** is the rest api to interact with the photo feed
- **frontend:** is the simple angular/ionic based frontend into the photo app
- **deployment:** takes care of the deployment to kubernetes

Each of these folders is completely independent from the rest. It can be extracted out of the project and taken to 
another completely new git repository and still works the same.

## General

### Install dependencies
For every folder that contains a `package.json` run `npm install` or `npm i` to have all required dependencies.

### Set environment variables
For every folder that contains a `.env.example` file, copy it to a `.env` file and set environment variables there.

### Creating docker images
For every folder that contains a `Dockerfile` run `docker build -t <image-name> .` to build the docker image.

## The four projects

### User REST API

- needs a database with the user table
- uses a postgresql db, that is exclusive to this User REST API
- you need 2 dbs set up on AWS for this: one for dev/test/staging and one for production 

### Feed REST API


#### Requirements
1. needs a postgresql database with the feed table, that is exclusive to this User REST API  
   - i created one database `udagram4feedms4dev` in AWS (db.t2.micro)  
   - for the chosen VPC security group i allowed PostgreSQL, TCP traffic from any source (inbound rules)
2. needs an S3 bucket for the images 
    - i created one `udagram-<account-id>-dev`
    - i activated default encryption AES-256
    - i added the following to the cors configuration
    ```
   <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>DELETE</AllowedMethod>
        <AllowedMethod>HEAD</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
    </CORSConfiguration>
    ```

#### Tests
Check out the postman collection in the tests folder and see which API endpoints there are.


### Frontend

asdfasdfsa asf 

### Deployment

asdfasdfsa asf 


## 



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
