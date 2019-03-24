> Currently this repository are NLS and moved to [demo-ts-node](https://github.com/zhangen69/demo-ts-node).

# TS-NODE App
> It's a application with MEAN Stack that means MongoDB, ExpressJs, Angular, and NodeJs. In case, it just a demostration.

# Used Frameworks/Library
- MongoDB v1.17.0 (Open Source Document Database)
- Angular v7.2.4 (TypeScript-based open-source web application framework)
- Angular Material v7.3.3 (Material Design for Angular)
- Angular Flex Layout v7.0.0-beta.23 (Sophisticated Layout API using Flexbox CSS + mediaQuery)
- ExpressJs v4.16.4 (Fast, unopinionated, minimalist web framework for Node.js)
- Mongoose v5.4.18 (elegant mongodb object modeling for node.js, ODM for MongoDB)
- Nodemon v1.18.10 (Serve app and restart automatically, Perfect for development)
- PromiseJs v8.0.2 (A website dedicated to promises in JavaScript)
- BodyParser v1.18.3 (Node.js body parsing middleware)
- @types/express v4.16.1
- @types/mongoose v5.3.23
- tslint v5.14.0
- typescript v3.3.4000

# Pending & Ready to Use
- cloudinary
- angular-jwt
- jsreport
- express-mailer

# WebApp Architecture & System Design
> I decided use split the Web Application to server & client as 2 different server that means it's might locate in a server (i.e. Cloud Server or your local computer) but it's start with different service. For example, in expertation I'll deploy the application to AWS Amazon EC2 Web Server with Window Server OS, so I decided use IIS as my service to start and running the client side server, for backend side it will use the nodejs pattern to run, but in design just imagine the scenario but not the reality case i decided to using for.

# Planning Features
### Angular App
- [ ] Standard Services (Model-Based)
- [ ] Upload Images (cloudinary/Google Photo API)
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
  - [ ] Upload Images
  - [x] Updated Audit for each Record (created by, created date, updated by, updated date)
- [ ] Send Email
- [ ] Generate Report
- [ ] Configuration Settings (Email Settings, Access Failed Settings, ...)
- [ ] Auto Generate Document Code for Collections, which is [Documentable]
- [ ] Activity Logs (Application Level)
