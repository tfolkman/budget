package converters

import (
	"log"
	"encoding/xml"
	"os"
	"strings"
	"time"
	"strconv"
	"github.com/tfolkman/budget/models"
	"github.com/astaxie/beego/orm"
	"math"
)

type Transaction struct {
	trnType string   `xml:"TRNTYPE"`
	datePosted string   `xml:"DTPOSTED"`
	trnAmt float64`xml:"TRNAMT"`
	name string`xml:"NAME"`
}

func ReadQfx(fileName string, dedup string) []models.Transactions {
	log.Println("Read QFX...")
	o := orm.NewOrm()
	xmlFile, err := os.Open(fileName)
        if err != nil {
            log.Fatal(err)
        }
	decoder := xml.NewDecoder(xmlFile)
	var transactions []models.Transactions
	var transaction models.Transactions
	var inElement string
	var text string
	var fitid string
	var refnum string
	var date time.Time
	var inflow float64
	var outflow float64
	var payee string
	var cnt int64
	for {
		// Read tokens from the XML document in a stream.
		t, _ := decoder.RawToken()
		if t == nil {
			break
		}
		switch se := t.(type) {
		case xml.CharData:
			text = strings.TrimSpace(string(t.(xml.CharData)))
			if inElement == "DTPOSTED"{
				date, _ = time.Parse("20060102", text[:8])
			}
			if inElement == "TRNAMT"{
				num, _ := strconv.ParseFloat(text, 64)
				if num < 0 {
					outflow = math.Abs(num)
					inflow = 0
				} else {
					inflow = num
					outflow = 0
				}
			}
			if inElement == "NAME"{
				payee = text
			}
			if inElement == "FITID"{
				fitid = text
			}
			if inElement == "REFNUM"{
				refnum = text
			}
		case xml.StartElement:
			inElement = se.Name.Local
		case xml.EndElement:
			// If we just read a StartElement token
			inElement = se.Name.Local
			// ...and its name is "page"
			if inElement == "STMTTRN" {
				transaction.Inflow = inflow
				transaction.Date = date
				transaction.Import = true
				transaction.Outflow = outflow
				transaction.Payee = payee
				transaction.Refnum = refnum
				transaction.Fitid = fitid
				if dedup == "true"{
					cnt, _ = o.QueryTable("transactions").Filter("fitid", fitid).
					Filter("payee", payee).Filter("outflow", outflow).
					Filter("inflow", inflow).Count()
					if cnt <= 0 {
						cnt, _ = o.QueryTable("transactions").Filter("refnum", fitid).
						Filter("date", date).Filter("payee", payee).Filter("outflow", outflow).
						Filter("inflow", inflow).Count()
					}
					if cnt == 0{
						transactions = append(transactions, transaction)
					}
				} else {
					transactions = append(transactions, transaction)
				}
			}
		default:
		}
	}
	return transactions
}
