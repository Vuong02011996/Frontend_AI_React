# UmiJS Boilerplate

UmiJS Boilerplate is a frontend template that includes HTML, CSS, and JS to build websites using ReactJS.

## Getting started

Open your preferred command line tool and run follow some steps below:

1. **`...`**.
2. `cd vn-travelmart-fe`.
3. `yarn` or `npm install` automatically to install plugins required for the build script based in `package.json` file.
4. `yarn start` or `npm start` to preview and development, then run url `http://localhost:8000` in your browser.
5. `yarn build` or `npm build` to build app.

-   Install latest node.js: https://nodejs.org​
-   Install latest yarn package manager: https://yarnpkg.com/​
-   Install node modules by running terminal command `yarn install`
-   Run the app `yarn start`
-   For build production files use `yarn build` (build to /dist/ folder)

## Project structure

```
vn-travelmart-fe/
├── config/
│   ├── config.js (config umijs)
│   ├── config.route.js (routes)
│   ├── defaultSettings.js
│   └── ...
│
├── src/
│   ├── assets
│   ├── components
│   ├── layouts
│   │   ├── login
│   │   ├── main
│   │   ├── public
│   │   ├── index.js
│   │   └── ...
│   │
│   ├── locales
│   ├── models
│   │   ├── global.js
│   │   ├── menu.js
│   │   ├── setting.js
│   │   ├── user.js
│   │   └── ...
│   ├── pages
│   │   ├── booking
│   │   ├── category
│   │   ├── customers
│   │   ├── dashboard
│   │   ├── login
│   │   ├── operating
│   │   ├── supplier
│   │   ├── system
│   │   ├── tours
│   │   └── ...
│   │
│   ├── services
│   │   ├── login.js
│   │   ├── menu.js
│   │   ├── user.js
│   │   └── ...
│   │
│   ├── ultis
│   │   ├── Authorized.js
│   │   ├── Helper.js
│   │   ├── utlis.js
│   │   ├── variables.js
│   │   └── ...
│   │
│   ├── wrappers
│   │   ├── auth.js
│   │   └── ...
│   │
└── package.js
```

### SASS structure

There is a main SCSS-file `global.scss`.

The `global.scss` imports all partials.

This is how the `sass`-folder looks like:

```
$ tree
.
styles
├── Antd
│   ├── import
│   |   └── …
│   ├── antd.cleanui.scss
│   └── …
├── Bootstrap
│   ├── import
│   |   └── …
│   ├── bootstrap.cleanui
│   └── …
└── …
```

### Convert local to Utc

```
Helper.getDateTime({
  value: Helper.setDate({
    ...setDateData,
    originValue: `date`,
  }),
  format: 'YYYY-MM-DD HH:mm:ss'
  isUTC: true,
})
```

### Convert Utc to local

```
Helper.getDateTime({
  value: `date`,
  format: 'YYYY-MM-DD HH:mm:ss'
  isUTC: false
})
```

### Covert Number to array

```
Array.from({ length: `number` }, (v, i) => i)
```

### Set permission menu

```
{
  title: 'Dashboard',
  key: 'dashboardAlpha',
  url: ['/dashboard'],
  con: 'icon icon-dashboard',
  permission: ['ROLES_ADD'],
  multiple: false
},
```

### Set permission routes

```
{
  path: '/roles',
  component: './roles',
  wrappers: [ '@/wrappers/auth'],
  authority: ['ROLES],
}
```

### Set Permission Button

```
subject: name function
action: action of function
<Button color="success" icon="plus" subject="roles" action="add">
  Add
</Button>
```

### QUERY BUILD WEB-APP DOCKER

```
sudo docker-compose stop

sudo docker-compose run --rm web yarn
sudo docker-compose run --rm web yarn build

sudo docker-compose up -d
```

# GIT

-   git commit -m"add fall detection" --no-verify
