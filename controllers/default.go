package controllers

import (
	"github.com/astaxie/beego"
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

func (this *MainController) SubmitBudget() {
	this.Ctx.WriteString("hi i am a post")
}
