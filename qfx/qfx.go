package qfx

import (
	"log"
	"encoding/xml"
	"os"
	"strings"
	"time"
	"strconv"
)

type Transaction struct {
	trnType string   `xml:"TRNTYPE"`
	datePosted string   `xml:"DTPOSTED"`
	trnAmt float64`xml:"TRNAMT"`
	name string`xml:"NAME"`
}

func ReadQfx(fileName string) {
	log.Println("Read QFX...")
	//o := orm.NewOrm()
	xmlFile, err := os.Open(fileName)
        if err != nil {
            log.Fatal(err)
        }
	decoder := xml.NewDecoder(xmlFile)
	var inElement string
	var text string
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
		case xml.StartElement:
			inElement = se.Name.Local
		case xml.EndElement:
			// If we just read a StartElement token
			inElement = se.Name.Local
			// ...and its name is "page"
			if inElement == "STMTTRN" {
				log.Println(date)
				log.Println(inflow)
				log.Println(outflow)
				log.Println(payee)
				log.Println(credit)
				log.Println(inElement)
				//importData := new(models.Transactions)
				//importData.Date = date
				//importData.Inflow = inflow
				//importData.Outflow = outflow
				//importData.Payee = payee
				//importData.Import = true
				//log.Println(payee)
				//log.Println(o.Insert(importData))
			}
		default:
		}
	}

	//log.Println(o.Insert(importData))
}
