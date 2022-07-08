
window.onload = get_todo();

let submit_task = document.getElementById('submit_task');
submit_task.addEventListener('click', add_todo);

let filter_created = document.getElementById('filter_created');
filter_created.addEventListener('click', flip_filter_created_time_range);

let filter_deadline = document.getElementById('filter_deadline');
filter_deadline.addEventListener('click', flip_filter_deadline);

let filterdeadline = false;
let filter_created_time_range = false;
let filter_deadline_rage = false;

function get_todo () {
    url = "http://127.0.0.1:5000/todo"

    let todos = null;

    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(data) {
            todos = data.todos;

            if (filterdeadline == true) {
                let filter_todos = [];
                for (let todo of todos) {
                    if(todo["deadline"] != null) {
                        filter_todos.push(todo);
                    } 
                }
                todos = filter_todos;
            }

            if (filter_created_time_range == true) {
                let filter_todos = [];

                let start_time = Date.parse(document.getElementById("created_start_time").value);
                let end_time = Date.parse(document.getElementById("created_end_time").value);
                
                console.log(start_time);
                console.log(end_time);
                
                for (let todo of todos) {
                    let time = Date.parse(todo["created_time"]);
                    if (time >= start_time && time <= end_time) {
                        filter_todos.push(todo);
                    }
                }

                todos = filter_todos;
            }

            if (filter_deadline_rage == true) {
                let filter_todos = [];

                let start_time = Date.parse(document.getElementById("deadline_start_time").value);
                let end_time = Date.parse(document.getElementById("deadline_end_time").value);
                
                console.log(start_time);
                console.log(end_time);
                
                for (let todo of todos) {
                    if (todo["deadline"] != null) {
                        let time = Date.parse(todo["deadline"]);
                        if (time >= start_time && time <= end_time) {
                            filter_todos.push(todo);
                        }
                    } else {
                        filter_todos.push(todo);
                    }
                }

                todos = filter_todos;
            }

            display_todo(todos);
        });
}

function add_todo () {
    let input_task = document.getElementById("new_task").value;
    let input_deadline = document.getElementById("new_deadline").value;

    fetch('http://127.0.0.1:5000/todo', {
        method: 'POST',
        mode: 'cors',

        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },

        body: JSON.stringify({
            task: input_task,
            deadline: input_deadline
        }),

        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then(function (data) {
            console.log(data);
        }).catch(function (error) {
            console.warn('Something went wrong.', error);
    });
}

function display_todo(todos) {
    let todo_id = document.querySelector('#displaytodo');
    let displaytodo_html = 
    `<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table id="todoTable" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="todoheader px-6 py-3">
                    id
                </th>
                <th scope="col" class="todoheader px-6 py-3">
                    Task
                </th>
                <th scope="col" class="todoheader px-6 py-3">
                    Created Time
                </th>
                <th scope="col" class="todoheader px-6 py-3">
                    Deadline
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Save</span>
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Delete</span>
                </th>
            </tr>
        </thead>
        <tbody>`;

    for (let todo of todos) {
        let temp_html = 
        `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
            ${todo["id"]}
        </td>
        <td contenteditable='true' class="px-6 py-4">
            ${todo["task"]}
        </td>
        <td class="px-6 py-4" >
            ${todo["created_time"]}
        </td>
        <td contenteditable='true' class="px-6 py-4">
            ${null_to_0(todo["deadline"])}
        </td>
        <td class="px-6 py-4 text-right">
            <a href="#" onclick="update_todo()" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Save</a>
        </td>
        <td class="px-6 py-4 text-right">
            <a href="#" onclick="delete_todo()" class="clicked_row font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
        </td>
        </tr>`;

        displaytodo_html += temp_html;
    }

    displaytodo_html += `
            </tbody>
        </table>
    </div>`;

    todo_id.innerHTML = displaytodo_html;


    let th = document.getElementsByClassName('todoheader');

    for(let c=0; c < th.length; c++) {
        th[c].addEventListener('click',item(c));
    }

    function item(c) {
        return function(){
            sortTable(c);
        }
    }

    function null_to_0(s) {
        if(s == null) {
            return '0';
        } 
        return s
    }
}

function flip_filter_created_time_range() {
    filter_created_time_range = true;
    get_todo();
}

function flip_filter_deadline() {
    filter_deadline_rage = true;
    get_todo();
}

// Source: https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(c) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("todoTable");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[c];
        y = rows[i+1].getElementsByTagName("TD")[c];

        //check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
}

function delete_todo () {

    console.log("DELETE");

    let id;
    
    var table = document.getElementsByTagName("table")[0];
    var tbody = table.getElementsByTagName("tbody")[0];
    tbody.onclick = function (e) {
        e = e || window.event;
        var target = e.srcElement || e.target;
        while (target && target.nodeName !== "TR") {
            target = target.parentNode;
        }
        if (target) {
            var cells = target.getElementsByTagName("td");
            id = cells[0].innerHTML.trim();
        }

        alert(typeof(id));

        let url = `http://127.0.0.1:5000/todo/delete/${id}`;

        alert(url);

        fetch(url)
        .then(res => res.text()) 
        .then(res => console.log(res))
    };

}

function update_todo () {
    console.log("SAVE");

    let id, task, deadline;

    var table = document.getElementsByTagName("table")[0];
    var tbody = table.getElementsByTagName("tbody")[0];
    tbody.onclick = function (e) {
        e = e || window.event;
        var target = e.srcElement || e.target;
        while (target && target.nodeName !== "TR") {
            target = target.parentNode;
        }
        if (target) {
            var cells = target.getElementsByTagName("td");
            id = cells[0].innerHTML.trim();
            task = cells[1].innerHTML.trim();
            deadline = cells[3].innerHTML.trim();
        }

        let post_json = {
            "task": task,
            "deadline": deadline
        }

        console.log(post_json);

        let url = `http://127.0.0.1:5000/todo/${id}`;

        fetch(url, {
            method: 'POST',
            mode: 'cors',

            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },

            body: JSON.stringify(post_json),

            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            }).then(function (data) {
                console.log(data);
            }).catch(function (error) {
                console.warn('Something went wrong.', error);
        });
    };
}