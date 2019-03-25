> Currently this repository are NLS and moved to [demo-ts-node](https://github.com/zhangen69/demo-ts-node).

# TS-NODE App
> It's a application with MEAN Stack that means MongoDB, ExpressJs, Angular, and NodeJs. In case, it just a demostration.

# Used Frameworks/Library
> dependencies
- body-parser v1.18.3
- cloudinary v1.13.2
- express v4.16.4
- mongoose v5.4.19
- multer v1.4.1
- multer-storage-cloudinary v2.2.1
- promise v8.0.3
> devDependencies
- @types/express v4.16.1
- @types/mongoose v5.3.23
- @types/multer v1.3.7
- nodemon v1.18.10
- tslint v5.14.0
- typescript v3.3.4000

# Pending & Ready to Use
- angular-jwt
- jsreport
- express-mailer

# WebApp Architecture & System Design
> I decided use split the Web Application to server & client as 2 different server that means it's might locate in a server (i.e. Cloud Server or your local computer) but it's start with different service. For example, in expertation I'll deploy the application to AWS Amazon EC2 Web Server with Window Server OS, so I decided use IIS as my service to start and running the client side server, for backend side it will use the nodejs pattern to run, but in design just imagine the scenario but not the reality case i decided to using for.

# Planning Features
### Angular App
- [x] Standard Services (Model-Based)
- [x] Upload Images (cloudinary & multer)
- [ ] Auth (JWT)
- [ ] HTTP Interception (Header-Authorization)
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
- [ ] Auth (JWT)
- [ ] Standard Model Inheritance Classes & Properties (Auditable, Documentable)
  - [x] Auditable
  - [ ] Documentable
- [ ] Standard User (Login, Change Password, Registration, Forgot Password)
- [ ] Standard Role & Authorization
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
  - [ ] Login
  - [ ] Registration
  - [ ] Forgot Password
  - [ ] Reset Password
  - [ ] Access Failed Lock
  - [ ] Update Profile
  - [ ] Change Password
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
