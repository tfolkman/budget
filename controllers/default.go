package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/tfolkman/budget/models"
	"strconv"
	"time"
	"log"
)

type MainController struct {
	beego.Controller
}

type Category struct {
	Category string `orm:"type(text)"`
	Amount float64
	Spent float64
	Remaining float64
}

func (c *MainController) Get() {
	c.TplName = "mainPage.tpl"
}

func (c *MainController) EditBudget() {
	c.TplName = "editbudget.tpl"
}

func (c *MainController) AddTransactions() {
	c.TplName = "addtransactions.tpl"
}

func (c *MainController) MainPage() {
	c.TplName = "mainPage.tpl"
}

type mystruct struct {
	FieldOne string `json:"field_one"`
}

func (c *MainController) GetUniques() {
	o := orm.NewOrm()
	var m map[string]orm.ParamsList
	m = make(map[string]orm.ParamsList)
	var accounts orm.ParamsList
	var payees orm.ParamsList
	var categories orm.ParamsList
	_, _ = o.Raw("select distinct account from transaction;").ValuesFlat(&accounts)
	_, _ = o.Raw("select distinct payee from transaction;").ValuesFlat(&payees)
	_, _ = o.Raw("select distinct name from budget;").ValuesFlat(&categories)
	m["accounts"] = accounts
	m["payees"] = payees
	m["categories"] = categories
	c.Data["json"] = &m
	c.ServeJSON();
}

func (c *MainController) GetBudget() {
	o := orm.NewOrm()
	var categories []Category
	num, err := o.Raw("select t.category, b.amount, sum(t.outflow)-sum(t.inflow) as spent, round((b.amount - (sum(t.outflow)-sum(t.inflow)))::numeric, 2) as remaining from transaction as t left join budget as b on b.name=t.category group by t.category, b.amount;").QueryRows(&categories)
	log.Println("get budget")
	log.Println(num)
	if err == nil {
    		log.Println("user nums: ", num)
	}
	c.Data["json"] = &categories
	c.ServeJSON()
}

func (c *MainController) PostTransactions() {
	reqBody := c.Ctx.Input.RequestBody
	var f interface{}
	json.Unmarshal(reqBody, &f)
	m := f.(map[string]interface{})
	o := orm.NewOrm()
	for i := 0; i < int(m["nChildren"].(float64))+1; i++ {
		transaction := new(models.Transaction)
		iString := strconv.Itoa(i)
		transaction.Account = m[iString].(map[string]interface{})["account"].(string)
		transaction.Payee = m[iString].(map[string]interface{})["payee"].(string)
		stringTime := m[iString].(map[string]interface{})["date"].(string)
		t, _ := time.Parse("2006-01-02", stringTime)
		log.Println(stringTime)
		log.Println(t)
		transaction.Date = t
		transaction.Category = m[iString].(map[string]interface{})["category"].(string)
		transaction.Note = m[iString].(map[string]interface{})["note"].(string)
		outflow, _ := strconv.ParseFloat(m[iString].(map[string]interface{})["outflow"].(string), 64)
		inflow, _ := strconv.ParseFloat(m[iString].(map[string]interface{})["inflow"].(string), 64)
		transaction.Outflow = outflow
		transaction.Inflow = inflow
		log.Println(o.Insert(transaction))
	}
	returnValue := &mystruct{FieldOne: "test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}

func (c *MainController) SubmitBudget() {
	reqBody := c.Ctx.Input.RequestBody
	var f interface{}
	json.Unmarshal(reqBody, &f)
	m := f.(map[string]interface{})
	o := orm.NewOrm()
	for i := 0; i < int(m["nChildren"].(float64))+1; i++ {
		budget := new(models.Budget)
		iString := strconv.Itoa(i)
		f, _ := strconv.ParseFloat(m[iString].(map[string]interface{})["amount"].(string), 64)
		budget.Amount = f
		budget.Month = m["month"].(string)
		budget.Name = m[iString].(map[string]interface{})["name"].(string)
		o.Insert(budget)
	}
	returnValue := &mystruct{FieldOne: "test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}
