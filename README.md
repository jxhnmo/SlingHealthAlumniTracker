## Sling Health Alumni Tracker
Alumni Tracker for TAMU Sling Health


## Requirements
This code has been run and tested using the following internal and external
components
Environment
• WSL Ubuntu
• Docker Engine 
• Docker container 
• Heroku 8.7.1
• Nodejs 10.8.2
Program
• Ruby 3.1.2p20
• Rails 7.0.6
• Rspec-rails
• Heroku PostgreSQL
• Other Ruby gems & versions
Tools
• Git Hub - (https://github.com/jxhnmo/SlingHealthAlumniTracker)
• RuboCop
• Simplecov
• Brakeman
• Jira
• VSCode IDE
• Others


## External Dependencies
- Docker - Download latest version at https://www.docker.com/products/docker-
desktop
- Heroku CLI - Download latest version at
https://devcenter.heroku.com/articles/heroku-cli
- Git - Downloat latest version at https://git-scm.com/book/en/v2/Getting-
Started-Installing-Git
- GitHub Desktop (Not needed, but HELPFUL) at https://desktop.github.com/


## Environmental Variables/Files
We have environment variables set up for the database
NEXT_PUBLIC_API_BASE_URL=https://alumni-tracker-sprint3-84062556e525.herokuapp.com/
LANG=en_US.UTF-8
RACK_ENV=production
RAILS_ENV=production
RAILS_LOG_TO_STDOUT=enabled
RAILS_SERVE_STATIC_FILES=enabled
JWT_SECRET_KEY=enabled
GOOGLE_OAUTH_CLIENT_ID:enabled
GOOGLE_OAUTH_CLIENT_SECRET:enabled
SIMPLE_FILE_UPLOAD_KEY: enabled 
## Installation and Setup
Download this code repository by using git:
`git clone https://github.com/jxhnmo/SlingHealthAlumniTracker.git’
or
‘git clone git@github.com:jxhnmo/SlingHealthAlumniTracker.git’
Run the following code in Powershell if using windows or the terminal using
Linux/Mac
`cd SlingHealthAlumniTracker`
`docker run -it --name alumni-dev -v $(pwd):/app -p 4000:4000 alumni_dev /bin/bash
Install the app
`bundle install`
Run the app
`rails server --binding:0.0.0.0 -p 4000`
Run the frontend of the program
`npm install`
npm run build
npm run dev
The application can be seen using a browser and navigating to
http://localhost:3000/


* John Mo johnmo@tamu.edu
* Ryan Kha ryankha@tamu.edu
* Hao Zheng zhenghao@tamu.edu
* Abdiel Rivera arivera15@tamu.edu
* Karthik Nakka Karthiknakka1@tamu.edu
