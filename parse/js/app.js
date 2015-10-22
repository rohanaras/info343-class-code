/*
    script for the index.html file
*/

Parse.initialize("rnPVLff4nz9OW4qu9GnkdD18TV4AzzxfLducfGQh", "x62CpPBIqQwvj2nW1eRSo50VWvUMxFSoyJG8NuVB"); //kevin
//Parse.initialize("HwGkNK09YRPy3ZajicPwpZMfX9vqCyc4ghFl2eh7", "14BQF3zAPvaOR1sh6aEzXX5Wk1LTnBFQopjr1Rbj"); //michele
//Parse.initialize("KbYkFVZmXgA44eI4GClBFlSQTmNqUSP0Kz2oe3IG", "6XpinlUENQPAWGyNQwKcSd3vZz8ihOGBy82leaAs"); //me

$(function() {
    'use strict';

    //new Task 'class' for parse
    var Task = Parse.Object.extend('Task');
    //new query that will return all tasks ordered by createAt
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.ascending('createdAt');
    //tasksQuery.notEqualTo('done', true); //this deletes completed tasks

    //reference to the task list element
    var tasksList = $('#tasks-list');

    //reference to the error message alert
    var errorMessage = $('#error-message');

    //current set of tasks
    var tasks = [];

    function displayError(err) {
        errorMessage.text(err.message);
        errorMessage.fadeIn();
    }

    function clearError() {
        errorMessage.hide();
    }

    function showSpinner() {
        $('.fa-spin').show()
    }

    function hideSpinner() {
        $('.fa-spin').hide()
    }

    function fetchTasks() {
        showSpinner();
        tasksQuery.find()
            .then(onData, displayError)
            .always(hideSpinner);
    }

    function onData(results) {
        tasks = results;
        renderTasks()
    }

    function renderTasks() {
        tasksList.empty();
        tasks.forEach(function(task) {
            var li = $(document.createElement('li'))
               .html(task.get('title'))
               .addClass(task.get('done') ? 'completed-task' : '')
               .appendTo(tasksList)
               .click(function() {
                   task.set('done', !task.get('done'));
                   task.save().then(renderTasks, displayError);
               });
            $(document.createElement('span'))
                .raty({readOnly: true,
                    score: (task.get('rating') || 0),
                    hints: ['crap', 'awful', 'ok', 'nice', 'awesome']
                })
                .appendTo(li)
        });
    }

    //when the user submits the new task form...
    $('#new-task-form').submit(function(evt) {
        evt.preventDefault();

        var titleInput = $(this).find('[name="title"]');
        var title = titleInput.val();
        var task = new Task();
        task.set('title', title);
        task.set('rating', $('#rating').raty('score'));

        task.save().then(fetchTasks, displayError)
            .then(function() {
                titleInput.val('');
                $('rating').raty('cancel', true);
            });

        return false;
    });

    //go and fetch tasks from Parse
    fetchTasks();

    //enable the rating ui element
    $('#rating').raty();

    window.setInterval(fetchTasks, 1000)

    window.scrollTo(0,document.body.scrollHeight);
});