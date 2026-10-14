COURSEHUB — ANGULARJS + NODE.JS + MONGODB

PROJECT FILES
- public/index.html : frontend layout
- public/style.css  : frontend styling
- public/app.js     : AngularJS frontend and API calls
- server.js         : Express API + MongoDB connection
- package.json      : Node dependencies and start command
- .env.example      : example database configuration

SETUP (LOCAL MONGODB)
1. Install Node.js and make sure MongoDB Server is installed and running.
2. Extract this project folder.
3. Open a terminal in this folder.
4. Install packages:
      npm install
5. Copy .env.example to a new file named .env.
6. If needed, edit MONGODB_URI in .env. For local MongoDB use:
      MONGODB_URI=mongodb://127.0.0.1:27017/coursehub
7. Start the app:
      npm start
8. Open this in the browser:
      http://localhost:3000

SETUP (MONGODB ATLAS)
1. Create a database user and allow your current IP address in Atlas Network Access.
2. Copy the connection string from Atlas.
3. Put it in .env as MONGODB_URI=your_connection_string
4. Replace <password> in the connection string with your database user's password.
5. Run npm start and open http://localhost:3000.

CRUD TEST
- Register: adds a student record to MongoDB.
- Read: records appear in the table after loading.
- Update: click Edit, change fields, then click Update.
- Delete: click Delete and confirm.
- Search: filters records in the visible table.

IMPORTANT NOTES
- Open the app using http://localhost:3000, not by double-clicking index.html.
- AngularJS is loaded from Google's CDN, so internet access is needed for the frontend.
- Existing sample records from the frontend-only demo are no longer preloaded. The table displays records actually stored in MongoDB.
- Do not upload your .env file or share its database password.
