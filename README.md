# demo-ts-node

## build node app
cd the `node-app` folder and enter command in command propmt or terminal
> npm start

## build angular app
cd the `ng-app` folder and enter command in command propmt or terminal
> ng build --prod

## build success
there have a dist folder in same level of `ng-app` and `node-app`

## install packages for dist
1. copy package.json from `node-app`
2. remove all `devDenpendencies` and `scripts`
3. cd the folder
4. run command `npm install`
5. run command `node app.js`
6 system are running on listening production process port or 3000
