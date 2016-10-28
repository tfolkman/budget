package converters

import (
  "testing"
	"github.com/tfolkman/budget/models"
	"time"
	"reflect"
	"github.com/astaxie/beego/orm"
	_ "github.com/mattn/go-sqlite3"
)

func init() {
	orm.RegisterDriver("mysql", orm.DRSqlite)
	orm.RegisterDataBase("default", "sqlite3", "../data/test.db")
	orm.RegisterModel(new(models.Transactions))
	_ = orm.RunSyncdb("default", false, true)
}

func TestDeDup(t *testing.T) {
	o := orm.NewOrm()
	_ = o.Raw("delete from transactions;")
	dedup := "true"
	transactions := ReadQfx("amex_test.qfx", dedup)
	o.InsertMulti(len(transactions), &transactions)
	transactions2 := ReadQfx("amex_test.qfx", dedup)
	v := len(transactions2)
	if v != 0 {
		t.Error("Expected 0, got ", v)
	}
}


func TestAmexImport(t *testing.T) {
	var transation1 models.Transactions
	transation1.Payee = "Test Name"
	date, _ := time.Parse("20060102", "20160924")
	transation1.Date = date
	transation1.Inflow = 0
	transation1.Outflow = 54.19
	transation1.Import = true
	transation1.Refnum = "32680531008212"
	transation1.Fitid = "32016268053100"

	var transaction2 models.Transactions
	transaction2.Payee = "Test Name 2"
	date2,  _ := time.Parse("20060102", "20160925")
	transaction2.Date = date2
	transaction2.Inflow = 0
	transaction2.Outflow = 14.02
	transaction2.Import = true
	transaction2.Refnum = "320162690124801"
	transaction2.Fitid = "320190539124801"

	var transaction3 models.Transactions
	transaction3.Payee = "Test Name 3"
	date3,  _ := time.Parse("20060102", "20160928")
	transaction3.Date = date3
	transaction3.Inflow = 0
	transaction3.Outflow = 27.23
	transaction3.Import = true
	transaction3.Fitid = "320162720990417"
	transaction3.Refnum = "3162720575990417"

	allTransactions := []models.Transactions{transation1, transaction2, transaction3}
	dedup := "false"
	transactions := ReadQfx("amex_test.qfx", dedup)
	v := reflect.DeepEqual(transactions, allTransactions)
	if v != true {
    		t.Error("Expected true, got ", v)
  	}
  }

func TestChaseImport(t *testing.T) {

	var transation1 models.Transactions
	transation1.Payee = "Test"
	date, _ := time.Parse("20060102", "20161026")
	transation1.Date = date
	transation1.Inflow = 0
	transation1.Outflow = 9.00
	transation1.Import = true
	transation1.Fitid = "204247606300000775963444"

	var transation2 models.Transactions
	transation2.Payee = "Test2"
	date2, _ := time.Parse("20060102", "20161025")
	transation2.Date = date2
	transation2.Inflow = 9.00
	transation2.Outflow = 0
	transation2.Import = true
	transation2.Fitid = "204247606300000775963445"

	allTransactions := []models.Transactions{transation1, transation2}
	dedup := "false"
	transactions := ReadQfx("chase_test.qfx", dedup)
	v := reflect.DeepEqual(transactions, allTransactions)
	if v != true {
		t.Error("Expected true, got ", v)
	}
}
