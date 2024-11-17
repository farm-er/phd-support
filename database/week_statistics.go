package database

import "log"

type WeekStatistic struct {
	Id   int
	Cons float64
	Prod float64
}

func (d *Db) GetWeekStatistics(id int) (WeekStatistic, error) {

	row := d.Db.QueryRow("SELECT * FROM WEEK_STATISTICS WHERE ID = ?", id)

	var stat WeekStatistic

	r := row.Scan(&stat.Id, &stat.Cons, &stat.Prod)

	if r != nil {
		log.Printf("week_statistics.go:28 : %s", r.Error())
		return WeekStatistic{}, r
	}

	return stat, nil

}

type DayStatistics struct {
	Week int
	Day  string
	Cons float32
	Prod float32
}

func (d *Db) GetDaysStatistics(weekId int) ([]DayStatistics, error) {

	res, r := d.Db.Query("SELECT * FROM DAY_STATISTICS WHERE WEEK = ?;", weekId)

	if r != nil {
		return nil, r
	}

	var stats []DayStatistics

	for res.Next() {
		var stat DayStatistics
		if r = res.Scan(&stat.Week, &stat.Day, &stat.Cons, &stat.Prod); r != nil {
			return nil, r
		}

		stats = append(stats, stat)
	}

	return stats, nil

}
