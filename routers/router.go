package routers

import (
	"github.com/tfolkman/budget/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
    beego.Router("/hello-world", &controllers.MainController{}, "get:HelloSitepoint")
}
