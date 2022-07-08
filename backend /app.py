from datetime import datetime
from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(100), nullable=False)
    created_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    deadline = db.Column(db.DateTime, nullable=True)


@app.route("/")
def root():
    return "Hello"


@app.route("/todo")
def get_all_todo():
    todo_list = Todo.query.all()
    todos = []

    for t in todo_list:
        todos.append({
            "id": t.id,
            "task": t.task,
            "created_time": t.created_time,
            "deadline": t.deadline,
        })
    print(todo_list)
    print(type(todo_list))
    print(todos)
    return {"todos": todos}


@app.route("/todo", methods=["POST"])
def add_todo():
    new_task = request.json['task']
    new_deadline = request.json['deadline']

    #date time string format -> 2022-07-12T19:41
    if new_deadline == "":
        new_todo = Todo(task = new_task)
    else:
        new_todo = Todo(task = new_task, deadline = datetime.strptime(new_deadline, '%Y-%m-%dT%H:%M'))

    db.session.add(new_todo)
    db.session.commit()

    return ('Success', 200)


@app.route("/todo/<int:id>", methods=["PUT"])
def update_todo(id):
    todo = Todo.query.filter_by(id=id).first()
    todo.complete = not todo.complete
    db.session.commit()
    return None


@app.route("/todo/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = Todo.query.filter_by(id=id).first()
    db.session.delete(todo)
    db.session.commit()
    return None

if __name__ == "__main__":
    db.create_all()
    app.run(host="127.0.0.1", port=5000, debug=True)