> Currently this repository are NLS and moved to [demo-ts-node](https://github.com/zhangen69/demo-ts-node).

# TS-NODE App
> It's a application with MEAN Stack that means MongoDB, ExpressJs, Angular, and NodeJs. In case, it just a demostration.

# Used Frameworks/Library (NodeJS)
> dependencies
- body-parser v1.18.3
- cloudinary v1.13.2
- express v4.16.4
- mongoose v5.4.19
- multer v1.4.1
- multer-storage-cloudinary v2.2.1
- promise v8.0.3
- bcrypt v3.0.5
- jsonwebtoken v8.5.1
> devDependencies
- @types/express v4.16.1
- @types/mongoose v5.3.23
- @types/multer v1.3.7
- @types/bcrypt v3.0.0
- @types/jsonwebtoken v8.3.2
- nodemon v1.18.10
- tslint v5.14.0
- typescript v3.3.4000

# Used Frameworks/Library (Angular)
> dependencies
- @angular/animations v7.2.0
- @angular/cdk v7.3.3
- @angular/common v7.2.0
- @angular/compiler v7.2.0
- @angular/core v7.2.0
- @angular/flex-layout v7.0.0-beta.23
- @angular/forms v7.2.0
- @angular/material v7.3.3
- @angular/platform-browser v7.2.0
- @angular/platform-browser-dynamic v7.2.0
- @angular/router v7.2.0
- core-js v2.5.4
- hammerjs v2.0.8
- ng2-file-upload v1.3.0
- ngx-toastr v10.0.2
- rxjs v6.3.3
- tslib v1.9.0
- zone.js v0.8.26
> devDependencies
- @angular-devkit/build-angular v0.12.0
- @angular/cli v7.2.3
- @angular/compiler-cli v7.2.0
- @angular/language-service v7.2.0
- @types/node v8.9.4
- @types/jasmine v2.8.8
- @types/jasminewd2 v2.0.3
- codelyzer v4.5.0
- jasmine-core v2.99.1
- jasmine-spec-reporter v4.2.1
- karma v3.1.1
- karma-chrome-launcher v2.2.0
- karma-coverage-istanbul-reporter v2.0.1
- karma-jasmine v1.1.2
- karma-jasmine-html-reporter v0.2.2
- protractor v5.4.0
- ts-node v7.0.0
- tslint v5.11.0
- typescript v3.2.2

# Pending & Ready to Use
- jsreport
- express-mailer

# WebApp Architecture & System Design
> I decided use split the Web Application to server & client as 2 different server that means it's might locate in a server (i.e. Cloud Server or your local computer) but it's start with different service. For example, in expertation I'll deploy the application to AWS Amazon EC2 Web Server with Window Server OS, so I decided use IIS as my service to start and running the client side server, for backend side it will use the nodejs pattern to run, but in design just imagine the scenario but not the reality case i decided to using for.

# Planning Features
### Angular App
- [x] Standard Services (Model-Based)
- [x] Upload Images (cloudinary & multer)
- [x] Auth (JWT)
- [x] HTTP Interception (Header-Authorization)
- [ ] Generate Rules
- [ ] Standard Form (Form Field, Validation, ...) 
- [ ] Standard List (Data-Table, Action, Button, Search, ...)

### Node App
- [x] Connect MongoDB (CRUD)
- [x] Routing (APIs)
- [x] Standard Controller (Model-Based)
- [ ] Generate Report (reportingjs)
  - [ ] Generate Sample Report
  - [ ] Generate Report Service (Service Layer)
  - [ ] Report Templates
- [x] Auth (JWT)
- [ ] Standard Model Inheritance Classes & Properties (Auditable, Documentable)
  - [x] Auditable
  - [ ] Documentable
- [x] Standard User (Login, Change Password, Registration, Forgot Password)
  - [x] Login
  - [x] Change Password
  - [x] Registration
  - [x] Forgot Password
- [ ] Standard Role & Authorization
  - [ ] Role CRUD
  - [ ] Assign Roles to Users
  - [ ] Identify Logged In User's Roles
- [ ] Send Email & Email Queue Service
  - [x] Send Sample Email
  - [ ] Send Email Service (Service Layer)
  - [ ] Email Queue (MongoDB)
  - [ ] Resend Email Service
- [ ] Configuration Settings
- [x] Upload Images
  - [x] Multer Uploader
  - [x] Cloudinary Uploader

### WebApp
- [ ] User & Auth
  - [x] Login
  - [x] Registration
  - [x] CRUD
  - [x] Forgot Password & Reset Password
  - [x] Reset Password (by admin)
  - [x] Access Failed Lock
  - [x] Update Profile
  - [x] Change Password
  - [ ] Search & Filter Users
- [ ] Product (or any other collection/module)
  - [x] Standard CRUD
  - [x] Upload Images
  - [x] Updated Audit for each Record (created by, created date, updated by, updated date)
  - [ ] Search & Filter Records
- [ ] Send Email
- [ ] Generate Report
- [ ] Configuration Settings (Email Settings, Access Failed Settings, ...)
- [ ] Auto Generate Document Code for Collections, which is [Documentable]
- [ ] Activity Logs (Application Level)
  - [x] HTTP Logs (XHR Logs)
