package qfx

import (
	"log"
	"bufio"
	"os"
	"strings"
	"time"
	"strconv"
	"github.com/tfolkman/budget/models"
	"github.com/astaxie/beego/orm"
)

func ReadQfx(fileName string) {
	log.Println("Read QFX...")
	o := orm.NewOrm()
	file, err := os.Open(fileName)
        if err != nil {
            log.Fatal(err)
        }
        defer file.Close()

	var date time.Time
	var outflow float64
	var inflow float64
	var credit bool
	var payee string

        scanner := bufio.NewScanner(file)
        for scanner.Scan() {
                text := scanner.Text()
		text = strings.TrimSpace(text)
		if strings.Contains(text, "<TRNTYPE>"){
			if strings.Contains(text, "CREDIT"){
				credit = true
			} else {
				credit = false
			}
		}
		if strings.Contains(text, "<DTPOSTED>"){
			date, _ = time.Parse("20060102", text[10:18])
		}
		if strings.Contains(text, "<TRNAMT>"){
			if credit {
				num, _ := strconv.ParseFloat(text[8:len(text)], 64)
				inflow = num
				outflow = 0.0
			} else {
				num, _ := strconv.ParseFloat(text[9:len(text)], 64)
				outflow = num
				inflow = 0.0
			}
		}
		if strings.Contains(text, "<NAME>"){
			payee = text[6:len(text)]
		}
		if strings.Contains(text, "</STMTTRN>"){
			importData := new(models.Transactions)
			importData.Date = date
			importData.Inflow = inflow
			importData.Outflow = outflow
			importData.Payee = payee
			importData.Import = true
			log.Println(payee)
			log.Println(o.Insert(importData))
		}
        }

        if err := scanner.Err(); err != nil {
            log.Fatal(err)
        }
}
