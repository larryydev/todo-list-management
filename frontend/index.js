let btn = document.getElementById('submit_task');
btn.addEventListener('click', add_todo);


function add_todo () {
    let input_task = document.getElementById("new_task").value;
    let input_deadline = document.getElementById("new_deadline").value;
    console.log(input_task);
    console.log(input_deadline);

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