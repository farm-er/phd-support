package database

type HistoryDay struct {
	Id  int
	Day string
}

func (d *Db) GetHistory() ([]HistoryDay, error) {

	rows, r := d.Db.Query("SELECT * FROM HISTORY_DAY;")

	if r != nil {
		return nil, r
	}

	var history []HistoryDay

	for rows.Next() {
		var his HistoryDay
		r = rows.Scan(&his.Id, &his.Day)
		if r != nil {
			return nil, r
		}
		history = append(history, his)
	}
	return history, nil
}

type Activity struct {
	Day      int
	Time     string
	Title    string
	Link     string
	Duration float32
	Type     string
}

func (d *Db) GetActivities(dayId int) ([]Activity, error) {
	rows, r := d.Db.Query("SELECT * FROM ACTIVITY WHERE DAY = ?;", dayId)

	if r != nil {
		return nil, r
	}

	var activities []Activity

	for rows.Next() {
		var activity Activity
		r = rows.Scan(&activity.Day, &activity.Time, &activity.Title, &activity.Link, &activity.Duration, &activity.Type)
		if r != nil {
			return nil, r
		}
		activities = append(activities, activity)
	}
	return activities, nil
}
