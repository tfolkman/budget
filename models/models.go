package models

import (
	"time"
)

type Budget struct {
	ID     int       `orm:"column(id)"`
	Month  time.Time `orm:"type(date)"`
	Name   string    `orm:"type(text)"`
	Amount float64
}
