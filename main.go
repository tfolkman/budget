package main

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/mattn/go-sqlite3"
	_ "github.com/tfolkman/budget/routers"
	"github.com/tfolkman/budget/models"
	"log"
	"time"
)

func init() {
	orm.RegisterDriver("mysql", orm.DRSqlite)
	orm.RegisterDataBase("default", "sqlite3", "./data/budget.db")
	orm.RegisterModel(new(models.Budget))
	orm.RegisterModel(new(models.Transactions))
}

func main() {

	// Database alias.
	name := "default"

	// Drop table and re-create.
	force := false

	// Print log.
	verbose := true

	// Error.
	err := orm.RunSyncdb(name, force, verbose)
	if err != nil {
    		log.Println(err)
	}

	o := orm.NewOrm()
	var count int
	o.Raw("SELECT count(*) as Count from budget").QueryRow(&count)

	if count == 0 {
		currentTime := time.Now()
		m := time.Now().Month()
		budget := new(models.Budget)
		budget.Amount = 200.00
		budget.Month = int(m)
		budget.Year = currentTime.Year()
		budget.Name = "Groceries"
		o.Insert(budget)
	}

	beego.Run()
}
