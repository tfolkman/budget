package models


type Budget struct {
	ID     uint32   `orm:"column(id)"`
	Budget string   `orm:"type(text)"`
	Month  string 	`orm:"type(text)"`
	Name   string   `orm:"type(text)"`
	Amount float64
}
