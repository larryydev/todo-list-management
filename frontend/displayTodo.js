function get_todo () {
    url = "http://127.0.0.1:5000/todo"
    let todos = null;

    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(data) {
            todos = data.todos;
            display_todo(todos);
        });
}

function display_todo(todos) {
    console.log(todos);

    let todo_id = document.querySelector('#displaytodo');
    let displaytodo_html = 
    `<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    id
                </th>
                <th scope="col" class="px-6 py-3">
                    Task
                </th>
                <th scope="col" class="px-6 py-3">
                    Created Time
                </th>
                <th scope="col" class="px-6 py-3">
                    Deadline
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>`;

    for (let todo of todos) {
        let temp_html = 
        `
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
            ${todo["id"]}
        </th>
        <td class="px-6 py-4">
            ${todo["task"]}
        </td>
        <td class="px-6 py-4">
            ${todo["created_time"]}
        </td>
        <td class="px-6 py-4">
            ${todo["deadline"]}
        </td>
        <td class="px-6 py-4 text-right">
            <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
        </td>
        </tr>`;

        displaytodo_html += temp_html;
    }

    displaytodo_html += `
            </tbody>
        </table>
    </div>`;

    todo_id.innerHTML = displaytodo_html;
}




window.onload = get_todo()