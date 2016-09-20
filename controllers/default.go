package controllers

import (
	"github.com/astaxie/beego"
	"encoding/json"
	"github.com/tfolkman/budget/models"
	"github.com/astaxie/beego/orm"
	"strconv"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.TplName = "mainPage.tpl"
}

func (c *MainController) NewBudget() {
	c.TplName = "newbudget.tpl"
}

func (c *MainController) MainPage() {
	c.TplName = "mainPage.tpl"
}

type mystruct struct {
  FieldOne string `json:"field_one"`
}

func (c *MainController) SubmitBudget() {
	reqBody := c.Ctx.Input.RequestBody
	var f interface{}
	json.Unmarshal(reqBody, &f)
	m := f.(map[string]interface{})
	o := orm.NewOrm();
	for i := 0; i < int(m["nChildren"].(float64))+1; i++ {
		budget := new(models.Budget);
		iString := strconv.Itoa(i)
		f, _ := strconv.ParseFloat(m[iString].(map[string]interface{})["amount"].(string), 64)
		budget.Amount = f
		budget.Budget = m["name"].(string)
		budget.Month = m["month"].(string)
		budget.Name = m[iString].(map[string]interface{})["name"].(string)
		o.Insert(budget)
	}
	returnValue := &mystruct{FieldOne:"test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}
