package main

import (
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/lib/pq"
	models "github.com/tfolkman/budget/models"
	_ "github.com/tfolkman/budget/routers"
)

func init() {
	orm.RegisterDriver("mysql", orm.DRPostgres)
	orm.RegisterDataBase("default", "postgres", "dbname=budget_test sslmode=disable")
	orm.RegisterModel(new(models.Budget))
}

func main() {
	// Database alias.
	name := "default"

	// Drop table and re-create.
	force := true

	// Print log.
	verbose := true

	// Error.
	err := orm.RunSyncdb(name, force, verbose)
	if err != nil {
		fmt.Println(err)
	}

	beego.Run()
}
