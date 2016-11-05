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
	Account  string    `orm:"type(text)" json:"account"`
	Date     time.Time `orm:"type(date)" json:"date"`
	Payee    string    `orm:"type(text)" json:"payee"`
	Category string    `orm:"type(text)" json:"category"`
	Note     string    `orm:"type(text)" json:"note"`
	Outflow  float64   `json:"outflow"`
	Inflow   float64   `json:"inflow"`
	Import   bool      `orm:"default(0)" json:"import"`
	Fitid 	 string    `orm:"type(text);null" json:"fitid"`
	Refnum 	 string    `orm:"type(text);null" json:"refnum"`
}

