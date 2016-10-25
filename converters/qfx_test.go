package converters

import (
  "testing"
	"github.com/tfolkman/budget/models"
	"time"
	"reflect"
)

func Test(t *testing.T) {
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
	transactions := ReadQfx("amex_test.qfx")
	v := reflect.DeepEqual(transactions, allTransactions)
	if v != true {
    		t.Error("Expected true, got ", v)
  	}
  }
