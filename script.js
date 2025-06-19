
class Model {
  constructor() {
   
    this.savetoggle = localStorage.getItem('savetoggle');
    this.todos=[]
    this.loadDataByToggle(this.savetoggle)

    // The state of the model, an array of todo objects, prepopulated with some data
/*     this.todos = [
      {id: 1, text: 'Run a marathon', complete: false},
      {id: 2, text: 'Plant a garden', complete: true},
    ] */
   //this._commit(this.todos)
  }
  loadDataByToggle(toggle){
    if(toggle === undefined || toggle === null){
      this.savetoggle = false
    }else{
      this.savetoggle = toggle
      if(this.savetoggle === "true"){
        this.todos = JSON.parse(localStorage.getItem('todos')) ||[]
        this.bindTodoListChanged(this.todos)
      }else{
        alert('Talves você possua dados salvos localmente!')
      }
    }
  }

  configChange(tgl){
    if(tgl === undefined || tgl === null){
      this.savetoggle = false
    }else{
      this.savetoggle = tgl
      if(tgl){
        const storagedTodos = JSON.parse(localStorage.getItem('todos')) ||[]
        this.todos = this.todos.concat(storagedTodos)
        localStorage.setItem('todos', JSON.stringify(this.todos))
        this.bindTodoListChanged(this.todos)
        location.reload();
      }else{
        localStorage.removeItem('todos')
      }
      
    }
    localStorage.setItem('savetoggle',this.savetoggle)
    //this.onConfigChanged(this.savetoggle)
    this.bindConfigChanged(this.savetoggle)
  }

  addTodo(todoText) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText,
      complete: false,
    }
    this.todos.push(todo)

    //this.onTodoListChanged(this.todos)
    this._commit()
  }

  // Map through all todos, and replace the text of the todo with the specified id
  editTodo(id, updatedText) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? {id: todo.id, text: updatedText, complete: todo.complete} : todo,
    )

    
    //this.onTodoListChanged(this.todos)
    this._commit(this.todos)
  }

  // Filter a todo out of the array by id
  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id)

    //this.onTodoListChanged(this.todos)
    this._commit(this.todos)
  }

  // Flip the complete boolean on the specified todo
  toggleTodo(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? {id: todo.id, text: todo.text, complete: !todo.complete} : todo,
    )

    //this.onTodoListChanged(this.todos)
    this._commit(this.todos)
  }

  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback
  }

  bindConfigChanged(callback) {
    this.onConfigChanged = callback
  }

  _commit() {
    //this.bindTodoListChanged(this.todos)
    this.onTodoListChanged(this.todos)
    if(this.savetoggle === "true"){
      localStorage.setItem('todos', JSON.stringify(this.todos))
    }else{
      localStorage.removeItem('todos')
    }
  } 

}

class View {
  constructor() {
    // The root element
    this.app = this.getElement('#root')
    // The title of the app
    this.title = this.createElement('h1')
    this.title.textContent = 'Mini Lista'

    // The form, with a [type="text"] input, and a submit button
    this.form = this.createElement('form')

    this.input = this.createElement('input')
    this.input.type = 'text'
    this.input.placeholder = 'Adicione tarefas aqui...'
    this.input.name = 'todo'

    this.submitButton = this.createElement('button')
    this.submitButton.textContent = 'Submit'

    // The visual representation of the todo list
    this.todoList = this.createElement('ul', 'todo-list')

    // Append the input and submit button to the form
    this.form.append(this.input, this.submitButton)

    this.config = this.createElement('div', 'div-config')
    const span = this.createElement('span')
    span.textContent = "Salvar Lista?"
    const checkbox = this.createElement('input','config-toggle')
    checkbox.type = 'checkbox'
    checkbox.checked = false

    this.config.append(checkbox, span)
    // Append the title, form, and todo list to the app
    this.app.append(this.title, this.form, this.config,this.todoList)
    
    this._temporaryTodoText
    this._initLocalListeners()
  }

  // Create an element with an optional CSS class
  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
  }

  // Retrieve an element from the DOM
  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  get _todoText() {
    return this.input.value
  }

  set_resetInput() {
    this.input.value = ''
  }

  displayTodos(todos) {
    // Delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild)
    }
    // Show default message
    if (todos.length === 0) {
      const p = this.createElement('p')
      p.textContent = 'Nada para fazer? Adicione uma nova tarefa!'
      this.todoList.append(p)
    } else {
      // Create todo item nodes for each todo in state
      todos.forEach(todo => {
        const li = this.createElement('li')
        li.id = todo.id

        // Each todo item will have a checkbox you can toggle
        const checkbox = this.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = todo.complete

        // The todo item text will be in a contenteditable span
        const span = this.createElement('span')
        span.contentEditable = true
        span.classList.add('editable')

        // If the todo is complete, it will have a strikethrough
        if (todo.complete) {
          const strike = this.createElement('s')
          strike.textContent = todo.text
          span.append(strike)
        } else {
          // Otherwise just display the text
          span.textContent = todo.text
        }

        // The todos will also have a delete button
        const deleteButton = this.createElement('button', 'delete')
        deleteButton.textContent = 'Delete'
        li.append(checkbox, span, deleteButton)

        // Append nodes to the todo list
        this.todoList.append(li)
      })
    }
  }
  displayConfig(toggle){
    const isTrueSet = (toggle === "true");
    this.getElement('.config-toggle').checked = isTrueSet
  }

  bindAddTodo(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      if (this._todoText) {
        handler(this._todoText)
        this.set_resetInput()
      }
    })
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener('click', event => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id)

        handler(id)
      }
    })
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener('change', event => {
      if (event.target.type === 'checkbox') {
        const id = parseInt(event.target.parentElement.id)

        handler(id)
      }
    })
  }

  bindToggleConfig(handler){
    this.config.addEventListener('change', e => {
      if(e.target.type === 'checkbox'){
        handler(e.target.checked)
      }
    })
  }

  // Update temporary state
  _initLocalListeners() {
    this.todoList.addEventListener('input', event => {
      if (event.target.className === 'editable') {
        this._temporaryTodoText = event.target.innerText
      }
    })
  }

  // Send the completed value to the model
  bindEditTodo(handler) {
    this.todoList.addEventListener('focusout', event => {
      if (this._temporaryTodoText) {
        const id = parseInt(event.target.parentElement.id)

        handler(id, this._temporaryTodoText)
        this._temporaryTodoText = ''
      }
    })
  }

}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    // Display initial todos
    this.onTodoListChanged(this.model.todos)
    //talves, desnecessário, já chamado no ctor da model
    this.onConfigChanged(this.model.savetoggle)

    this.view.bindAddTodo(this.handleAddTodo)
    this.view.bindDeleteTodo(this.handleDeleteTodo)
    this.view.bindToggleTodo(this.handleToggleTodo)
    this.view.bindToggleConfig(this.handleToggleConfig)
    this.view.bindEditTodo(this.handleEditTodo)

    this.model.bindTodoListChanged(this.onTodoListChanged)
    this.model.bindConfigChanged(this.onConfigChanged)
  }

  onTodoListChanged = (todos) => {
    this.view.displayTodos(todos)
  }

  onConfigChanged = (togl) => {
    this.view.displayConfig(togl)
  }

  handleAddTodo = (todoText) => {
    this.model.addTodo(todoText)
  }

  handleEditTodo = (id, todoText) => {
    this.model.editTodo(id, todoText)
  }

  handleDeleteTodo = (id) => {
    this.model.deleteTodo(id)
  }

  handleToggleTodo = (id) => {
    this.model.toggleTodo(id)
  }

  handleToggleConfig = (togl) =>{
    this.model.configChange(togl)
  }

}

const app = new Controller(new Model(), new View())