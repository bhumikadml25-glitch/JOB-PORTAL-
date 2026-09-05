# CareerSphere — Modified 3-File Prototype

Files:
1. index.html
2. script.js
3. README.txt

## New features

### 1. Job-search sidebar
The Jobs page now has a sidebar inspired by the screenshot style:
- Job / Company / Skill search
- Location
- Experience
- Work Mode
- Company
- Main Skill
- Minimum Salary slider
- Show My Matches
- Reset Filters

### 2. Job cards
The cards show:
- Company
- Role
- Location
- Work mode
- Degree
- Salary
- Required skills
- Profile Match %

### 3. Application form
After selecting a job, the user can review requirements and submit:
- Name
- Email
- Phone
- College
- Degree
- Skills
- Why they are suitable
- Resume file name

### 4. Email submission
The application form is connected to FormSubmit and is configured for:
bhumikadandare27@gmail.com

IMPORTANT:
The first submission normally triggers a FormSubmit activation/confirmation email. Confirm/activate the form from the email before expecting regular submissions to arrive.

For reliable testing, run the project through a local web server such as VS Code Live Server rather than opening index.html directly.

### 5. Resume note
This prototype stores the selected resume file name in localStorage. It does not upload the actual resume file in this version. If you want actual resume attachments in the email, the next step should be a proper multipart form/backend integration.

## Run
Open the folder in VS Code and use Live Server, then open index.html.

## Tech
HTML + Tailwind CSS CDN + JavaScript + localStorage + FormSubmit
