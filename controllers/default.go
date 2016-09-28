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

func (c *MainController) EditTransactions() {
	c.TplName = "editTransactions.tpl"
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

func (c *MainController) GetTransactions(){
	var month int
	var year int
	c.Ctx.Input.Bind(&month, "month")
	c.Ctx.Input.Bind(&year, "year")
	o := orm.NewOrm()
	var transactions []models.Transaction
	_, _ = o.Raw("select * from transaction where extract(month from date) = ? and extract(year from date) = ?;",
		month, year).QueryRows(&transactions)
	c.Data["json"] = &transactions
	c.ServeJSON()
}


func (c *MainController) GetUniques() {
	o := orm.NewOrm()
	var m map[string]orm.ParamsList
	m = make(map[string]orm.ParamsList)
	var accounts orm.ParamsList
	var payees orm.ParamsList
	var categories orm.ParamsList
	var months orm.ParamsList
	var years orm.ParamsList
	_, _ = o.Raw("select distinct account from transaction;").ValuesFlat(&accounts)
	_, _ = o.Raw("select distinct payee from transaction;").ValuesFlat(&payees)
	_, _ = o.Raw("select distinct name from budget;").ValuesFlat(&categories)
	_, _ = o.Raw("select distinct extract(month from date) from transaction order by date_part;").ValuesFlat(&months)
	_, _ = o.Raw("select distinct extract(year from date) from transaction order by date_part;").ValuesFlat(&years)
	m["accounts"] = accounts
	m["payees"] = payees
	m["categories"] = categories
	m["months"] = months
	m["years"] = years
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
