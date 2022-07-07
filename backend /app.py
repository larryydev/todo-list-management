from datetime import datetime
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)


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
    return dict(todo_list)


@app.route("/todo", methods=["POST"])
def add_todo():
    new_task = request.json['task']
    new_deadline = request.json['deadline']

    new_todo = Todo(task = new_task, new_deadline = new_deadline)

    db.session.add(new_todo)
    db.session.commit()


@app.route("/todo/put/<int:id>")
def update_todo(id):
    todo = Todo.query.filter_by(id=id).first()
    todo.complete = not todo.complete
    db.session.commit()


@app.route("/todo/delete/<int:id>")
def delete_todo(id):
    todo = Todo.query.filter_by(id=id).first()
    db.session.delete(todo)
    db.session.commit()


if __name__ == "__main__":
    db.create_all()
