package routers

import (
	"github.com/astaxie/beego"
	"github.com/tfolkman/budget/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/edit_budget", &controllers.MainController{}, "get:EditBudget")
	beego.Router("/edit_transactions", &controllers.MainController{}, "get:EditTransactions")
	beego.Router("/update_transaction", &controllers.MainController{}, "post:UpdateTransaction")
	beego.Router("/delete_transaction", &controllers.MainController{}, "post:DeleteTransaction")
	beego.Router("/get_transactions", &controllers.MainController{}, "get:GetTransactions")
	beego.Router("/get_budget", &controllers.MainController{}, "get:GetBudget")
	beego.Router("/get_uniques", &controllers.MainController{}, "get:GetUniques")
	beego.Router("/main_page", &controllers.MainController{}, "get:MainPage")
	beego.Router("/post_transactions", &controllers.MainController{}, "post:PostTransactions")
	beego.Router("/add_transactions", &controllers.MainController{}, "get:AddTransactions")
}
