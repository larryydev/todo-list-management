# Todo-list-management

## Use

1. Use a python 3 virtual environment and install requirements.txt in /backend foler
2. Run app.py in the virtual environment
3. Open index.html in /frontend folder

## Functions

1. To sort - click on the table headers
2. To edit - you can edit task name and deadline by clicking on that element (deadline to be in "Tue, 12 Jul 2022 21:07:00 GMT" format)
 
## Technologies

Python (Flask), HTML, Tailwind CSS, JavaScript 

## API Routes

GET /todo - get all todo 
<br>
POST /todo - create a new todo 
<br>
POST /todo/{id} - update the id todo
<br>
GET /todo/delete/{id} - delete the id todo