package routers

import (
	"github.com/astaxie/beego"
	"github.com/tfolkman/budget/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/edit_budget", &controllers.MainController{}, "get:EditBudget")
	beego.Router("/get_budget", &controllers.MainController{}, "get:GetBudget")
	beego.Router("/get_uniques", &controllers.MainController{}, "get:GetUniques")
	beego.Router("/main_page", &controllers.MainController{}, "get:MainPage")
	beego.Router("/submit_budget", &controllers.MainController{}, "post:SubmitBudget")
	beego.Router("/add_transactions", &controllers.MainController{}, "get:AddTransactions")
}
