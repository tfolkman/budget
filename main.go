package main

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/lib/pq"
	_ "github.com/tfolkman/budget/routers"
	"github.com/tfolkman/budget/models"
)

func init() {
	orm.RegisterDriver("mysql", orm.DRPostgres)
	orm.RegisterDataBase("default", "postgres", "dbname=budget_test sslmode=disable")
	orm.RegisterModel(new(models.Budget))
}

func main() {
	beego.Run()
}
