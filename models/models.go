package models


type Budget struct {
	ID     int
	Budget string   `orm:"type(text)"`
	Month  string 	`orm:"type(text)"`
	Name   string   `orm:"type(text)"`
	Amount float64
}
