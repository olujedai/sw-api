# Star Wars API

## Description

App for communicating with the Star Wars API. Try it at


## Getting Started
1. Make sure you have the following installed on your machine:
* Git: [Windows](https://git-scm.com/download/win), [Mac](https://git-scm.com/download/mac). (Linux: Please install using your system's package manager)
* Docker: [Windows](https://docs.docker.com/docker-for-windows/install/), [Mac](https://docs.docker.com/docker-for-mac/install/), [Linux](https://docs.docker.com/install/linux/docker-ce/ubuntu/) (ensure you have the latest version).

2. Ensure that docker is running on your machine by running ```docker run hello-world``` 

3. Clone (copy to your local machine) the repository using the command:
```git clone git@github.com:olujedai/sw-api.git```

4. Navigate to the api folder (```cd sw-api```)

5. Set up the environment variables by running ```cp env.sample .env``` and modify the defaults.

6. Build and run the backend services using ```yarn start:docker```.
It will take a fair bit of time the first time you do it, subsequently it will be much faster. If you get any errors, please get in touch.  

7. Launch the containers using ```docker-compose up``` .

8. Navigate to  ```http://localhost:3000``` on your computer to view the openapi documentation.

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# in docker
$ yarn start:docker

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

This app is [MIT licensed](LICENSE).
