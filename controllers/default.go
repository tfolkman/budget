package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/tfolkman/budget/models"
	"github.com/tfolkman/budget/qfx"
	"strconv"
	"time"
	"log"
	"io/ioutil"
)

var budgetQuery string

func init() {
	q, _ := ioutil.ReadFile("./static/queries/budget.sql")
	budgetQuery = string(q)
}

type MainController struct {
	beego.Controller
}

type Category struct {
	Category string `orm:"type(text)"`
	Budgeted float64
	Spent float64
	Remaining float64
}

type NewBudget struct {
	Year string `json:"year"`
	Month string `json:"month"`
	Base bool `json:"base"`
	BaseYear string `json:"baseYear"`
	BaseMonth string `json:"baseMonth"`
}

func (c *MainController) Get() {
	c.TplName = "mainPage.tpl"
}

func (c *MainController) EditBudget() {
	c.TplName = "editbudget.tpl"
}

func (c *MainController) ImportData(){
	c.TplName = "importData.tpl"
}

func (c *MainController) NewBudget() {
	c.TplName = "newbudget.tpl"
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

func (c *MainController) GetFile() {
    	c.SaveToFile("importData", "./data/import.qfx")
	qfx.ReadQfx("./data/import.qfx")
	c.TplName = "mainPage.tpl"
}

func (c *MainController) GetTransactions(){
	var month string
	var year string
	c.Ctx.Input.Bind(&month, "month")
	c.Ctx.Input.Bind(&year, "year")
	o := orm.NewOrm()
	log.Println(month)
	log.Println(year)
	var transactions []models.Transactions
	_, _ = o.Raw("select * from transactions where strftime('%m', date) = ? and strftime('%Y', date) = ?;",
		month, year).QueryRows(&transactions)
	log.Println(transactions)
	c.Data["json"] = &transactions
	c.ServeJSON()
}

func (c *MainController) PostNewBudget(){
	o := orm.NewOrm()
	var budgets []models.Budget
	reqBody := c.Ctx.Input.RequestBody
	var newBudget NewBudget
	json.Unmarshal(reqBody, &newBudget)
	baseYear, _ := strconv.Atoi(newBudget.BaseYear)
	year, _ := strconv.Atoi(newBudget.Year)
	month, _ := strconv.Atoi(newBudget.Month)
	baseMonth, _ := strconv.Atoi(newBudget.BaseMonth)
	o.QueryTable("budget").Filter("month", baseMonth).Filter("year", baseYear).All(&budgets)
	if newBudget.Base {
		o.QueryTable("budget").Filter("month", month).Filter("year", year).Delete()
		for _, element := range budgets {
			var tmpBudget models.Budget
			tmpBudget.Month = month
			tmpBudget.Amount = element.Amount
			tmpBudget.Name = element.Name
			tmpBudget.Year = year
			o.Insert(&tmpBudget)
		}
	} else {
		budget := new(models.Budget)
		budget.Amount = 200.00
		budget.Month = month
		budget.Year = year
		budget.Name = "Groceries"
		o.Insert(budget)
	}
	returnValue := &mystruct{FieldOne: "test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}


func (c *MainController) GetUniques() {
	o := orm.NewOrm()
	var m map[string]interface{}
	m = make(map[string]interface{})
	var accounts orm.ParamsList
	var payees orm.ParamsList
	var categories orm.ParamsList
	var months orm.ParamsList
	var budget_months orm.ParamsList
	var years orm.ParamsList
	var budget_years orm.ParamsList
	_, _ = o.Raw("select distinct account from transactions;").ValuesFlat(&accounts)
	_, _ = o.Raw("select distinct payee from transactions;").ValuesFlat(&payees)
	_, _ = o.Raw("select distinct name from budget;").ValuesFlat(&categories)
	_, _ = o.Raw("select distinct month from budget;").ValuesFlat(&budget_months)
	_, _ = o.Raw("select distinct year from budget;").ValuesFlat(&budget_years)
	_, _ = o.Raw("select distinct strftime('%m', date) as month from transactions order by month;").ValuesFlat(&months)
	_, _ = o.Raw("select distinct strftime('%Y', date) as year from transactions order by year;").ValuesFlat(&years)
	if accounts == nil {
		m["accounts"] = [1]string{"Visa"}
	} else {
		m["accounts"] = accounts
	}
	if payees == nil {
		m["payees"] = [1]string{"Costco"}
	} else {
		m["payees"] = payees
	}
	m["categories"] = categories
	m["months"] = months
	m["budget_months"] = budget_months
	m["years"] = years
	m["budget_years"] = budget_years
	c.Data["json"] = &m
	c.ServeJSON();
}

func (c *MainController) UpdateTransaction() {
	o := orm.NewOrm()
	reqBody := c.Ctx.Input.RequestBody
	transaction := new(models.Transactions)
	json.Unmarshal(reqBody, &transaction)
	log.Println(o.Update(transaction))
	returnValue := &mystruct{FieldOne: "test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}

func (c *MainController) UpdateBudget() {
	o := orm.NewOrm()
	reqBody := c.Ctx.Input.RequestBody
	budget := new(models.Budget)
	json.Unmarshal(reqBody, &budget)
	log.Println(budget)
	log.Println(o.Update(budget))
	returnValue := &mystruct{FieldOne: "test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}

func (c *MainController) InsertBudget() {
	o := orm.NewOrm()
	reqBody := c.Ctx.Input.RequestBody
	budget := new(models.Budget)
	json.Unmarshal(reqBody, &budget)
	log.Println(o.Insert(budget))
	returnValue := &mystruct{FieldOne: "test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}

func (c *MainController) DeleteTransaction() {
	o := orm.NewOrm()
	reqBody := c.Ctx.Input.RequestBody
	var ids []int
	json.Unmarshal(reqBody, &ids)
	for _, element := range ids {
		log.Println(o.Delete(&models.Transactions{ID: element}))
	}
	returnValue := &mystruct{FieldOne: "test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}

func (c *MainController) DeleteBudget() {
	o := orm.NewOrm()
	reqBody := c.Ctx.Input.RequestBody
	var budgets []models.Budget
	json.Unmarshal(reqBody, &budgets)
	for _, element := range budgets {
		log.Println(element)
		o.QueryTable("budget").Filter("month", element.Month).Filter("year", element.Year).Filter("name", element.Name).Delete()
	}
	returnValue := &mystruct{FieldOne: "test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}

func (c *MainController) GetSummary() {
	var month string
	var year string
	c.Ctx.Input.Bind(&month, "month")
	c.Ctx.Input.Bind(&year, "year")
	o := orm.NewOrm()
	var categories []Category
	num, err := o.Raw(budgetQuery, month, year).QueryRows(&categories)
	log.Println("get budget")
	log.Println(num)
	if err == nil {
		log.Println("user nums: ", num)
	}
	c.Data["json"] = &categories
	c.ServeJSON()
}

func (c *MainController) GetBudget() {
	var month int
	var year int
	c.Ctx.Input.Bind(&month, "month")
	c.Ctx.Input.Bind(&year, "year")
	o := orm.NewOrm()
	var budgets []models.Budget
	num, err := o.QueryTable("budget").Filter("month", month).Filter("year", year).All(&budgets)
	log.Println("get budget")
	log.Println(num)
	if err == nil {
    		log.Println("user nums: ", num)
	}
	c.Data["json"] = &budgets
	c.ServeJSON()
}

func (c *MainController) PostTransactions() {
	reqBody := c.Ctx.Input.RequestBody
	var f interface{}
	json.Unmarshal(reqBody, &f)
	m := f.(map[string]interface{})
	o := orm.NewOrm()
	for i := 0; i < int(m["nChildren"].(float64))+1; i++ {
		transaction := new(models.Transactions)
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
		log.Println(transaction)
		log.Println(o.Insert(transaction))
	}
	returnValue := &mystruct{FieldOne: "test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}

