package database

import "time"

type Task struct {
	Id      int64
	List    string
	Title   string
	Created string
	For     string
	Body    string
}

func (d *Db) GetTasks() ([]Task, error) {

	res, r := d.Db.Query("SELECT * FROM TASKS ORDER BY ID DESC;")

	if r != nil {
		return nil, r
	}

	var tasks []Task

	for res.Next() {
		var task Task
		if r = res.Scan(&task.Id, &task.List, &task.Title, &task.Created, &task.For, &task.Body); r != nil {
			return nil, r
		}

		tasks = append(tasks, task)
	}

	return tasks, nil

}

// For is the number of hours until the deadline
func (d *Db) AddTask(list string, title string, For string, body string) (Task, error) {

	task := Task{
		List:    list,
		Title:   title,
		Created: time.Now().Format("2006-01-02 15:04:05"),
		For:     For, //time.Now().Add(time.Duration(For) * time.Hour).Format("2006-01-02"),
		Body:    body,
	}

	res, r := d.Db.Exec("INSERT INTO TASKS ( LIST, TITLE, CREATED, FOR, BODY) VALUES( ?, ?, ?, ?, ?);",
		task.List,
		task.Title,
		task.Created,
		task.For,
		task.Body,
	)

	if r != nil {
		return Task{}, r
	}

	task.Id, r = res.LastInsertId()

	if r != nil {
		return Task{}, r
	}

	return task, nil
}

func (d *Db) UpdateTaskList(id int, list string) error {

	_, r := d.Db.Exec("UPDATE TASKS SET LIST = ? WHERE ID=?", list, id)

	if r != nil {
		return r
	}

	return nil

}

func (d *Db) RemoveTask(id int) error {
	_, r := d.Db.Exec("DELETE FROM TASKS WHERE ID=?", id)

	if r != nil {
		return r
	}

	return nil
}
