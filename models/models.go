package models

import (
	"time"
)

type Budget struct {
	ID     int
	Month int
	Year   int
	Name   string `orm:"type(text)"`
	Amount float64
}

type Transactions struct {
	ID       int
	Account  string    `orm:"type(text)"`
	Date     time.Time `orm:"typee(text)"`
	Payee    string    `orm:"typ(date)"`
	Category string    `orm:"typ(date)"`
	Note     string    `orm:"typ(date)"`
	Outflow  float64
	Inflow   float64
	Import   bool      `orm:"default(0)"`
}

