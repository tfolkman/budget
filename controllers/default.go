package controllers

import (
	"github.com/astaxie/beego"
	"log"
	"encoding/json"
	"github.com/tfolkman/budget/models"
	"github.com/astaxie/beego/orm"
	"strconv"
	"hash/fnv"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.TplName = "welcome.tpl"
}

func (c *MainController) NewBudget() {
	c.TplName = "newbudget.tpl"
}

type mystruct struct {
  FieldOne string `json:"field_one"`
}

func hash(s string) uint32 {
        h := fnv.New32a()
        h.Write([]byte(s))
        return h.Sum32()
}

func (c *MainController) SubmitBudget() {
	reqBody := c.Ctx.Input.RequestBody
	var f interface{}
	json.Unmarshal(reqBody, &f)
	m := f.(map[string]interface{})
	budget := new(models.Budget);
	o := orm.NewOrm();
	for i := 0; i < int(m["nChildren"].(float64)); i++ {
		iString := strconv.Itoa(i)
		f, _ := strconv.ParseFloat(m[iString].(map[string]string)["amount"], 64)
		budget.Amount = f
		budget.Budget = m["name"].(string)
		budget.ID = hash(m["name"].(string) + "_" + iString)
		budget.Month = m["month"].(string)
		budget.Name = m[iString].(map[string]string)["name"]
		log.Println(o.Insert(budget))
	}
	for key, value := range m {
	    log.Println("Key:", key, "Value:", value)
	}
	c.TplName = "newbudget.tpl"
	returnValue := &mystruct{FieldOne:"test"}
	c.Data["json"] = &returnValue
	c.ServeJSON()
}
