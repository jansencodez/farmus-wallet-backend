@echo off
mkdir farmus-wallet-backend
cd apps/farmus-wallet-backend

mkdir api
mkdir api\wallet
mkdir utils
mkdir config
mkdir middleware

type NUL > api\wallet\deposit.js
type NUL > api\wallet\withdraw.js
type NUL > api\wallet\transact.js

type NUL > utils\mpesaClient.js
type NUL > config\db.js
type NUL > middleware\auth.js

type NUL > .env
type NUL > vercel.json
type NUL > package.json
type NUL > index.js

echo Directory structure and files created successfully.
