/* global $ */
$(document).ready(function(){
  $.getJSON("/api/todos")
  .then(addTodos);
  
  $('#todoInput').keypress(e => {
    if(e.which === 13) {
      createTodo();
    }
  });
  
  $('.list').on('click', 'li', function() {
      updateTodo($(this));
  });
  
  $('.list').on('click', 'span', function(e) {
    e.stopPropagation();
    removeTodo($(this).parent());
  });
});

function addTodos(todos){
  //add todos to page
  todos.forEach(todo => {
    addTodo(todo);
  });
}

function addTodo(todo) {
  const newTodo = $(`<li class="task">${todo.name} <span>X</span></li>`);
  newTodo.data('id', todo._id);
  newTodo.data('completed', todo.completed);
  if(todo.completed){
    newTodo.addClass("done");
  }
  $('.list').append(newTodo);
}

function createTodo() {
  //send request to create new todo
  var usrInput = $('#todoInput').val();
  $.post('/api/todos', {name: usrInput})
  .then(newTodo => {
    $('#todoInput').val('');
    addTodo(newTodo);
  })
  .catch(err => {
    console.log(err);
  });
}

function removeTodo(todo) {
  const clickedId = todo.data('id');
  const deleteUrl = `/api/todos/${clickedId}`; 
  $.ajax({
      method: 'DELETE',
      url: deleteUrl
    })
    .then(data => todo.remove())
    .catch(err => console.log(err));
}

function updateTodo(todo) {
  const updateUrl = `/api/todos/${todo.data('id')}`;
  var isDone = !todo.data('completed');
  var updateData = {completed: isDone};
  $.ajax({
    method: 'PUT',
    url: updateUrl,
    data: updateData
  })
  .then(updatedTodo => {
    todo.toggleClass("done");
    todo.data('completed', isDone);
  });
}