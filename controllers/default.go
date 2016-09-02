package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "index.tpl"
}

func (main *MainController) HelloSitepoint() {
    main.Data["Website"] = "My Website"
    main.Data["Email"] = "your.email.address@example.com"
    main.Data["EmailName"] = "Your Name"
    main.TplName = "budget.tpl"
}
