##### The Udagram Project

# 1 ToDos

- Screenshot of TravisCI which shows the successful build and deploy steps
- The public GitHub repo and the docker hub images
- Screenshot of kubectl get pod which shows all running containers
- Screenshot of the application
- [Also see the Project Rubric](https://review.udacity.com/#!/rubrics/2572/view)


# 2 Setup

The project has four folders: 
- **restapi-user:** is the rest api to authenticate the user
- **restapi-feed:** is the rest api to interact with the photo feed
- **frontend:** is the simple angular/ionic based frontend into the photo app
- **deployment:** takes care of the deployment to kubernetes

Each of these folders is completely independent from the rest. It can be extracted out of the project, taken to 
another git repository, run in a different environment and still works the same (given it's configured correctly).

## 2.1 General

### 2.1.1 Install dependencies
For every folder that contains a `package.json`, run `npm install` or `npm i` to have all required dependencies.

### 2.1.2 Set environment variables
For every folder that contains a `.env.example` file, copy it to a `.env` file and set environment variables there.

### 2.1.3 Creating docker images
For every folder that contains a `Dockerfile` run `docker build -t <image-name> .` to build the docker image.

## 2.2 User REST API

### 2.2.1 What it does
- Allows registering users and logging in
- For authentication and to keep the credentials locally we use [JWT](https://jwt.io/introduction/)

### 2.2.2 Requirements
1. needs a postgresql database with the user table, that should be exclusive to this User REST API
   - for AWS cost reasons, i used the database `udagram4feedms4dev` in AWS (db.t2.micro) that we also use for feeds  
   - for the chosen VPC security group i allowed PostgreSQL, TCP traffic from any source (inbound rules)

### 2.2.3 Running it & tests
- Use `npm run dev` to run the project in your dev environment.
- Check out the postman collection in the tests folder and see which API endpoints there are.

## 2.3 Feed REST API

### 2.3.1 What it does
- Provides access to the feeds.
- You can currently list feed items or show one specific one without being logged in
- You can create and edit a feed item when you're logged in (no ownership check implemented!)
- For read and write access to the S3 bucket, we use [signed urls](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html)

### 2.3.2 Requirements
1. needs a postgresql database with the feed table, that is exclusive to this Feed REST API  
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

### 2.3.3 Running it & tests
- Use `npm run dev` to run the project in your dev environment.
- Check out the postman collection in the tests folder and see which API endpoints there are.


## 2.4 Frontend

xxxxxxxxxxxxxxx

## 2.5 Deployment

xxxxxxxxxxx


# 3 Branches

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
