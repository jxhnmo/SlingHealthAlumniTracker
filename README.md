## Sling Health Alumni Tracker
Alumni Tracker for TAMU Sling Health


## Table of Contents
An interactive list of sections for easy navigation, especially for longer
READMEs


## Requirements
This code has been run and tested using the following internal and external
components
Environment
• WSL Ubuntu
• Docker Engine v?
• Docker container v?
• Heroku v?
• Nodejs v?
Program
• Ruby 3.1.2p20
• Rails 7.0.6
• Rspec-rails v?
• PostgreSQL v?
• Other Ruby gems & versions
Tools
• Git Hub - main branch with LINK to repo
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
NEXT_PUBLIC_API_BASE_URL=https://alumnitrackertest-958bb6be1026.herokuapp.com
LANG=en_US.UTF-8
RACK_ENV=production
RAILS_ENV=production
RAILS_LOG_TO_STDOUT=enabled
RAILS_SERVE_STATIC_FILES=enabled
## Installation and Setup
Download this code repository by using git:
`git clone https://github.com/jxhnmo/SlingHealthAlumniTracker.git’
or
‘git clone git@github.com:jxhnmo/SlingHealthAlumniTracker.git’
Run the following code in Powershell if using windows or the terminal using
Linux/Mac
`cd project-sprint-3-zlp-interviewer`
`docker run --rm -it --volume "$(pwd):/rails_app" -e
DATABASE_USER=test_app -e DATABASE_PASSWORD=test_password -p 3000:3000
dmartinez05/ruby_rails_postgresql:latest`
Install the app
`bundle install && rails webpacker:install && rails db:create &&
db:migrate`
Run the app
`rails server --binding:0.0.0.0`
The application can be seen using a browser and navigating to
http://localhost:3000/


## Deployment
1. Work with your github repository environment_test that you created
previously.
It should contain the test_app that we built in lab 1 and 2.
2. (Start your docker and work in your terminal) Make sure you have dev, test
and main branches. However, since we’re not really going to develop any new
features, we won’t be using the dev branch in the assignment. We’ll be using test
and main branches.
First, use $ git status to see if your git is tracking the current dir.
If you haven’t created dev and test branches, please do it now. For example,
commands to create a test branch with git:
![image](https://user-images.githubusercontent.com/71986659/135948039-
22d70b59-03fa-4c4a-8662-b7c939c08520.png)
Note:
$ git checkout -b <branch> will create and switch to the new branch
$ git checkout <branch> will only switch to the branch
You don’t need to create a new branch in Github in advance, because $ git
push origin <branch> will do it for you if Github doesn’t have a
corresponding branch.
After you create all three branches, your Github should look like this:
![image](https://user-images.githubusercontent.com/71986659/135948077-
9673b8ee-26ce-401b-88e7-41b7effbabed.png)
3. Switch to the test branch. Command - $ git checkout test
4. Tests can be run using an RSpec test suite using:
`rspec spec/`
Or run all unit and integration tests using:
`rspec .`
5. We want to run the migration on each deploy automatically.
Create a file named Procfile in the root dir with this line of code
![image](https://user-images.githubusercontent.com/71986659/135948122-
5a288ca7-b2d9-4bf3-994f-764ef745efa3.png)
6. Create a root route in config/routes.rb
![image](https://user-images.githubusercontent.com/71986659/135948148-
f2db8c45-f85c-4aab-978f-4541420953bf.png)
7. Save the changes and push it to origin/test
$ git add .
$ git commit -m “add Procfile and route”
$ git push origin test
8. CI/CD has been implemented in the GitHub Actions in the repo here ->
https://github.com/PatelHarshank/ZLPInterviewer/actions
9. From the Heroku Dashboard
Click the New button in the top right of your app list and select Create
new pipeline:
<insert remaining instructions for set-up in the cloud or locally>


## Usage
Clear instructions on how to use the project
Code examples demonstrating basic functionality
Screenshots or GIFs to illustrate the project in action


## Features
List of key features and capabilities

## Documentation
Links to more comprehensive documentation
API references for libraries or frameworks
Troubleshooting tips or FAQs
- https://www.w3schools.com/howto/howto_js_filter_table.asp

## Credits and Acknowledgments
List of contributors and maintainers
Acknowledgment of third-party resources or libraries used
- 
- OpenAI's GPT-3.5 for generating parts of the documentation

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE)
file for details.

## Third-Party Libraries
This project uses the following third-party libraries:
- Library1 (MIT License)
- Library2 (Apache 2.0 License)

## Contact Information
Any questions, contact information is below.


* John Mo johnmo@tamu.edu
* Ryan Kha ryankha@tamu.edu
* Hao Zheng zhenghao@tamu.edu
* Abdiel Rivera arivera15@tamu.edu
* Karthik Nakka Karthiknakka1@tamu.edu
