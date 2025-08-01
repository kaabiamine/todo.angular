import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from './todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [TodoService]
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTitle = '';
  editingId: string | null = null;
  editTitle = '';

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(todos => this.todos = todos);
  }

  addTodo() {
    if (!this.newTitle.trim()) return;
    this.todoService.addTodo({ title: this.newTitle, completed: false }).subscribe(todo => {
      this.todos.push(todo);
      this.newTitle = '';
    });
  }

  startEdit(todo: Todo) {
    this.editingId = todo._id || null;
    this.editTitle = todo.title;
  }

  saveEdit(todo: Todo) {
    if (!this.editTitle.trim() || !todo._id) return;
    this.todoService.updateTodo({ ...todo, title: this.editTitle }).subscribe(updated => {
      todo.title = updated.title;
      this.editingId = null;
      this.editTitle = '';
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editTitle = '';
  }

  toggleTodo(todo: Todo) {
    this.todoService.updateTodo({ ...todo, completed: !todo.completed }).subscribe(updated => {
      todo.completed = updated.completed;
    });
  }

  deleteTodo(todo: Todo) {
    if (!todo._id) return;
    this.todoService.deleteTodo(todo._id).subscribe(() => {
      this.todos = this.todos.filter(t => t._id !== todo._id);
    });
  }
}
