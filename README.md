# Node.js code assessment

## Commmands

- Run Server:

```bash
npm run start
```
- Run Test

```bash
npm run test
```
## Stack

- Node.js v14.16.0
- Test: mocha / chai / sinon / proxyquire 
- config: To manage differents config files
- express.js
- pino: Logs in stdout
- node-fetch: To make requests.

## Architecture Decisions

- API have two layers:

     -Server: Contains the code to run a REST server.

     -Services: Resolves business logic.

I decided to divide the communication through the network of the business logic, for this reason /services and /server are at the same level, this design is intended to change the way a microservice communicates in a productive scenario without having to perform major changes.

## Middlewares

Error Handler: This was developed to solve in a single point all the received exceptions, to log them and return the answer. /src/server/middleware.js

## Doubts

I am not entirely clear if in the POST /login I had to generate jwt tokens on my side. If this was the purpose, it would use the jsonwebtoken library. Inside the token it would save the role of the user along with the expiration date.