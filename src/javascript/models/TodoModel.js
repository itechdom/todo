import {observable} from 'mobx';

export default class TodoModel {
	store;
	todo_id;
	@observable title;
	@observable completed;

	constructor(store, todo_id, title, completed) {
		this.store = store;
		this.todo_id = todo_id;
		this.title = title;
		this.completed = completed;
	}

	toggle() {
		this.completed = !this.completed;
	}

	destroy() {
		this.store.todos.remove(this);
	}

	setTitle(title) {
		this.title = title;
	}

	toJS() {
		return {
			todo_id: this.todo_id,
			title: this.title,
			completed: this.completed
		};
	}

	static fromJS(store, object) {
		return new TodoModel(store, object.todo_id, object.title, object.completed);
	}
}
