package routers

import (
	"github.com/astaxie/beego"
	"github.com/tfolkman/budget/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/new_budget", &controllers.MainController{}, "get:NewBudget")
	beego.Router("/main_page", &controllers.MainController{}, "get:MainPage")
	beego.Router("/submit_budget", &controllers.MainController{}, "post:SubmitBudget")
}
