package routers

import (
	"github.com/astaxie/beego"
	"github.com/tfolkman/budget/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/edit_budget", &controllers.MainController{}, "get:EditBudget")
	beego.Router("/new_budget", &controllers.MainController{}, "get:NewBudget")
	beego.Router("/post_new_budget", &controllers.MainController{}, "post:PostNewBudget")
	beego.Router("/edit_transactions", &controllers.MainController{}, "get:EditTransactions")
	beego.Router("/update_transaction", &controllers.MainController{}, "post:UpdateTransaction")
	beego.Router("/delete_transaction", &controllers.MainController{}, "post:DeleteTransaction")
	beego.Router("/get_transactions", &controllers.MainController{}, "get:GetTransactions")
	beego.Router("/get_budget", &controllers.MainController{}, "get:GetBudget")
	beego.Router("/get_summary", &controllers.MainController{}, "get:GetSummary")
	beego.Router("/get_uniques", &controllers.MainController{}, "get:GetUniques")
	beego.Router("/main_page", &controllers.MainController{}, "get:MainPage")
	beego.Router("/post_transactions", &controllers.MainController{}, "post:PostTransactions")
	beego.Router("/add_transactions", &controllers.MainController{}, "get:AddTransactions")
	beego.Router("/delete_budget", &controllers.MainController{}, "post:DeleteBudget")
	beego.Router("/insert_budget", &controllers.MainController{}, "post:InsertBudget")
	beego.Router("/update_budget", &controllers.MainController{}, "post:UpdateBudget")
}
