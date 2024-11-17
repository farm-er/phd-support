package database

import (
	"errors"
	"log"
)

type Statistics struct {
	WeekId     int
	Todo       int
	InProgress int
	Done       int
	Hold       int
}

func (d *Db) GetStatistics() (Statistics, error) {

	res, r := d.Db.Query("SELECT * FROM STATISTICS;")

	if r != nil {
		log.Printf("statistics.go:21 : %s", r.Error())
		return Statistics{}, r
	}

	if !res.Next() {
		return Statistics{}, errors.New("no statistics found")
	}
	var stat Statistics
	if r = res.Scan(&stat.WeekId, &stat.Todo, &stat.InProgress, &stat.Done, &stat.Hold); r != nil {
		log.Printf("statistics.go:28 : %s", r.Error())
		return Statistics{}, r
	}
	return stat, nil
}
