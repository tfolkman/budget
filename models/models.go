package models

import (
	"time"
)

type Budget struct {
	ID     int
	Budget string `orm:"type(text)"`
	Month  string `orm:"type(text)"`
	Name   string `orm:"type(text)"`
	Amount float64
}

type Transaction struct {
	ID       int
	Account  string    `orm:"type(text)"`
	Date     time.Time `orm:"typee(text)"`
	Payee    string    `orm:"typ(date)"`
	Category string    `orm:"typ(date)"`
	Note     string    `orm:"typ(date)"`
	Outflow  float64
	Inflow   float64
}
