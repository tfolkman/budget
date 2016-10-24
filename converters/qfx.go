package converters

import (
	"log"
	"encoding/xml"
	"os"
	"strings"
	"time"
	"strconv"
	"github.com/tfolkman/budget/models"
)

type Transaction struct {
	trnType string   `xml:"TRNTYPE"`
	datePosted string   `xml:"DTPOSTED"`
	trnAmt float64`xml:"TRNAMT"`
	name string`xml:"NAME"`
}

func ReadQfx(fileName string) []models.Transactions {
	log.Println("Read QFX...")
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
	var credit bool
	var date time.Time
	var inflow float64
	var outflow float64
	var payee string
	for {
		// Read tokens from the XML document in a stream.
		t, _ := decoder.RawToken()
		if t == nil {
			break
		}
		switch se := t.(type) {
		case xml.CharData:
			text = string(t.(xml.CharData))
			if inElement == "TRNTYPE"{
				if strings.Contains(text, "CREDIT"){
					credit = true
				} else {
					credit = false
				}
			}
			if inElement == "DTPOSTED"{
				date, _ = time.Parse("20060102", text[:8])
			}
			if inElement == "TRNAMT"{
				if credit {
					num, _ := strconv.ParseFloat(text, 64)
					inflow = num
					outflow = 0.0
				} else {
					num, _ := strconv.ParseFloat(text[1:len(text)], 64)
					outflow = num
					inflow = 0.0
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
				transactions = append(transactions, transaction)
			}
		default:
		}
	}
	return transactions
}
