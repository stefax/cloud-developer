##### The Udagram Project

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

As described in the Project Instructions of Lesson 4 (Monolith to Microservices), this is based on the [Starter Repo](https://github.com/scheeles/cloud-developer/tree/06-ci/course-03/exercises).

The only relevant folder for this project is the folder `course-03/exercises`.


# 1 Project ToDos

## What to submit
- [x] Screenshot of TravisCI which shows the successful build and deploy steps  
    - see [Successful-Build-*.png files in project-submission-attachments](./project-submission-attachments)
- [x] The public GitHub repo and the docker hub images  
    - see [my GitHub repo](https://github.com/stefax/cloud-developer/tree/master/course-03/exercises)   
    - see my [User REST API microservice image on dockerhub](https://hub.docker.com/repository/docker/modul1/udacity-restapi-user)
    - see my [Feed REST API microservice image on dockerhub](https://hub.docker.com/repository/docker/modul1/udacity-restapi-feed)
    - see my [Frontend image on dockerhub](https://hub.docker.com/repository/docker/modul1/udacity-frontend)
    - see my [Reverse-Proxy image on dockerhub](https://hub.docker.com/repository/docker/modul1/reverseproxy)
- [x] Screenshot of kubectl get pod which shows all running containers
    - see [kubectl-get-pods-with-all-running-containers.png in the project-submission-attachments](./project-submission-attachments)
- [x] Screenshot of the application
    - see [Screenshot-of-the-Udagram-Application.png in project-submission-attachments](./project-submission-attachments)

[See Project Rubric requirements here](https://review.udacity.com/#!/rubrics/2572/view).


# 2 Setup

The project has four folders: 
- **restapi-user:** is the rest api to authenticate the user
- **restapi-feed:** is the rest api to interact with the photo feed
- **frontend:** is the simple angular/ionic based frontend into the photo app
- **deployment:** takes care of the deployment to kubernetes

Each of these folders is completely independent from the rest. It can be extracted out of the project, taken to 
another git repository, run in a different environment and still works the same (given it's configured correctly).

## 2.1 General

### 2.1.1 Install node & docker

- This project depends on Nodejs and Node Package Manager (NPM), download it here [https://nodejs.com/en/download](https://nodejs.org/en/download/).
- This project requires [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).
- The Ionic Command Line Interface is required to serve and build the frontend. Instructions for installing the CLI can be found in the [Ionic Framework Docs](https://ionicframework.com/docs/installation/cli).

### 2.1.2 Install dependencies
For every folder that contains a `package.json`, run `npm install` or `npm i` to have all required dependencies.

### 2.1.3 Set environment variables
For every folder that contains a `.env.example` file, copy it to a `.env` file and set environment variables there.

### 2.1.4 Creating docker images
For every folder that contains a `Dockerfile` run `docker build -t <image-name> .` to build the docker image from inside
the folder.

## 2.2 User REST API

### 2.2.1 What it does
- Allows registering users and logging in
- For authentication and to keep the credentials locally we use [JWT](https://jwt.io/introduction/)
  - **IMPORTANT NOTE**: the secret used for JWT signing and verification is shared between the User and the Feed REST API!
- **Important Note on CORS**: To enable API access from any frontend, the `Access-Control-Allow-Origin` is currently set to `*`. 
It would be better to restrict that.

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
- **Important Note on CORS**: To enable API access from any frontend, the `Access-Control-Allow-Origin` is currently set to `*`. 
It would be better to restrict that.

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

The frontend is based on angular/ionic and uses the two APIs (2.2 and 2.3) in order to create the Udagram app. So, they need to be running first (best test them with the respective Postman test collections).

### 2.4.1 Different environments
Ionic uses environment files located in `./src/environments/environment.*.ts` to load configuration variables at runtime. By default `environment.ts` is used for development and `environment.prod.ts` is used for production. The `apiHost` variable should be set to your server url either locally or in the cloud.

### 2.4.2 Running the Development Server
Ionic CLI provides an easy to use development server to run and autoreload the frontend. This allows you to make quick changes and see them in real time in your browser. To run the development server, open terminal and run:

```bash
ionic serve
```

### 2.4.3 Building the Static Frontend Files
Ionic CLI can build the frontend into static HTML/CSS/JavaScript files. These files can be uploaded to a host to be consumed by users on the web. Build artifacts are located in `./www`. To build from source, open terminal and run:
```bash
ionic build
```

## 2.5 Reverse Proxy

This is a simple reverse proxy setup based on nginx in order to have one single API Gateway, which gives access to 
other APIs behind it. There we could implement the authentication. This is a TODO for later.

## 2.6 Deployment

### 2.6.1 Running it locally with docker-compose

- Create a .env file from the .env.example and set the environment variables 
- Build the images: `docker-compose -f docker-compose-build.yaml build`
- Run the container: `docker-compose up`
- Call the [frontend app](http://localhost:8100)

### 2.6.2 Pushing the images to the Docker Regsitry manually

- Run `docker login` to have your Docker Registry (e.g. Docker Hub) configured in case you haven't done it yet
- Run `docker-compose -f docker-compose-build.yaml push`
- This step is not required if Travis CI is configured to push images to the registry

### 2.6.3 CI using Travis CI

- Travis CI is triggered to build the docker images if you are on master (e.g. when a pull request from a dev branch is merged into master).
- It also pushes the images into the Docker Registry. For that Travis CI needs to log in which is done using two environment variables that need to be set in your Travis CI environment:
    - DOCKER_USERNAME (not the email but the user name which is also part of your registry url)
    - DOCKER_PASSWORD (**please note:** it is recommended to work with an access token here and **not** with your actual password; you can create these in your docker hub account security settings)
- See `.travis.yml` in the root folder for configuration details

### 2.6.4 Deployment to Production with Kubernetes

#### 2.6.4.1 Prerequesites

For detailed instructions, see [kubeone quickstart aws](https://github.com/kubermatic/kubeone/blob/master/docs/quickstart-aws.md).

- **Software installed**
  - **KubeOne** or an equivalent tool is installed
    - a command-line utility for installing, managing, and upgrading Kubernetes clusters
    - runs only on Linux and Mac OS
    - instructions for installing KubeOne on Linux or macOS, [see here](https://github.com/kubermatic/kubeone)
  - **Terraform** installed, if the infrastructure on AWS should be created through this tool
    - an open-source infrastructure as code tool that enables users to define and provision a datacenter infrastructure on all relevant cloud infrastructure providers
    - instructions for installing Terraform, [see here](https://www.terraform.io/downloads.html)
  - **kubectl** or an equivalent tool is installed
    - command line tool for controlling Kubernetes clusters
    - instructions for installing kubectl, [see here](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- **Credentials are set up**
  - IAM user with sufficient rights
  - have an access key (with id and secret key) stored in ... 
    - env vars `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
    - or in your default profile in ~/.aws/credentials and env var `AWS_PROFILE=...` is set up accordingly
- **Infrastructure is created (with Terraform)**
  - In the console go to the `kubeone-terraform` directory
  - Run `terraform init`
  - Adapt the `terraform.tfvars` file and set the variables that you want to have different from the defaults
  - Run `terraform plan` to see what changes will be made
  - Run `terraform apply` to proceed and provision the infrastructure
- **Kubernetes is installed on the infrastructure (with KubeOne)**
  - In the console go to the `kubeone-terraform` directory
  - Run `kubeone install ./config.yaml --tfjson .`
  - Use `kubectl --kubeconfig=<cluster_name>-kubeconfig` or for convenience do e.g. `export KUBECONFIG=$PWD/udagram-kubeconfig` in order to just use `kubectl`
- Files `aws-secret.yaml`, `env-secret.yaml` and `env-configmap.yaml` are created and filled with actual data based on their <name>.example.yaml counterparts
  - To encode secrets with base64, use `echo -n "<mystring>" | base64` - the `-n` **is important to avoid having line breaks** included in the string! 
    
#### 2.6.4.2 Deployment to Kubernetes

- In the console go to the `kubeone-terraform` directory
- Run `kubectl apply -f ../k8s/config-maps-and-secrets/aws-secret.yaml  -f ../k8s/config-maps-and-secrets/env-configmap.yaml  -f ../k8s/config-maps-and-secrets/env-secret.yaml` which creates the config maps and secrets in kubernetes
- Run `kubectl apply -f ../k8s/backend-feed-deployment.yaml -f ../k8s/backend-feed-service.yaml` to deploy feed replica-set and service
- Run `kubectl apply -f ../k8s/backend-user-deployment.yaml -f ../k8s/backend-user-service.yaml` to deploy user replica-set and service
- Run `kubectl apply -f ../k8s/reverseproxy-deployment.yaml -f ../k8s/reverseproxy-service.yaml` to deploy reverseproxy replica-set and service
- Run `kubectl apply -f ../k8s/frontend-deployment.yaml -f ../k8s/frontend-service.yaml` to deploy frontend replica-set and service

**To check on your local machine forward the ports:**
- Forward port 8100 for the frontend: `kubectl port-forward service/frontend 8100:8100`
- Forward port 8080 for the backend: `kubectl port-forward service/reverseproxy 8080:8080`

TOOD: xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RollingUpdate: This is the default update strategy.
With RollingUpdate update strategy, after you update a DaemonSet template, old DaemonSet pods will be killed, and new DaemonSet pods will be created automatically, in a controlled fashion. At most one pod of the DaemonSet will be running on each node during the whole update process.
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

#### 2.6.4.3 Remove & clean everything

In order to avoid costs, do the following:
- Run `kubeone reset config.yaml --tfjson .` inside the `kubeone-terraform` directory to reset all your kubernetes setup
- Run `terraform destroy` to delete the infrastructure from AWS EC2


# 3 Branches

For this project, we are using the following branching conventions:

- **dev** is the development branch. To work on anything, even better create your own branch named `<type>/<name>` where `<type>` is one of these:
    - `feature` for any feature work
    - `fix` for any bug fix
    - `junk` for any throwaway branch to experiment with  
  
  and `<name>` is the actual name, e.g.: `feature/add-logout`
  
- **staging** is our testing branch. The staging environment is accessible for QA and the other teams, so that they can
review and (manually) test our changes there if necessary. 

- **master** is our production branch. What goes in there needs to be production ready. The branch is protected, so it is not possible to commit directly against this branch. Use pull requests (PRs) from staging instead.
