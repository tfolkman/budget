package controllers

import (
	"github.com/astaxie/beego"
	"log"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.TplName = "welcome.tpl"
}

func (c *MainController) NewBudget() {
	c.TplName = "newbudget.tpl"
}

type mystruct struct {
  FieldOne string `json:"field_one"`
}

func (c *MainController) SubmitBudget() {
	log.Printf("'Received %+v'", c.Ctx.Input.RequestBody)
	test := &mystruct{ FieldOne: "test" }
    	c.Data["json"] = &test
    	c.ServeJSON()
	c.TplName = "mainPage.tpl"
}
