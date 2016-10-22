package qfx

import (
	"log"
	"encoding/xml"
	"os"
)

type Transaction struct {
	trnType string   `xml:"TRNTYPE"`
	datePosted string   `xml:"DTPOSTED"`
	trnAmt float64`xml:"TRNAMT"`
	name string`xml:"NAME"`
}

type Result struct {
	XMLName xml.Name `xml:"OFX"`
	Transactions []Transaction `xml:"STMTTRN"`
}


func ReadQfx(fileName string) {
	log.Println("Read QFX...")
	//o := orm.NewOrm()
	xmlFile, err := os.Open(fileName)
        if err != nil {
            log.Fatal(err)
        }
	v := Result{}
	decoder := xml.NewDecoder(xmlFile)
	var inElement string
	var text string
	//var trnType string
	//var datePosted string
	//var trnAmt float64
	//var name string
	for {
		// Read tokens from the XML document in a stream.
		t, _ := decoder.RawToken()
		if t == nil {
			break
		}
		switch se := t.(type) {
		case xml.CharData:
			if inElement == "TRNTYPE"{
				log.Println(string(t.(xml.CharData)))
			}
		case xml.StartElement:
			inElement = se.Name.Local
			if inElement == "TRNTYPE" {
				log.Println(inElement)
				//decoder.DecodeElement(&text, &se)
				log.Println(text)
			}
			//if strings.Contains(text, "<TRNTYPE>"){
			//	if strings.Contains(text, "CREDIT"){
			//		credit = true
			//	} else {
			//		credit = false
			//	}
			//}
			//if strings.Contains(text, "<DTPOSTED>"){
			//	date, _ = time.Parse("20060102", text[10:18])
			//}
			//if strings.Contains(text, "<TRNAMT>"){
			//	if credit {
			//		num, _ := strconv.ParseFloat(text[8:len(text)], 64)
			//		inflow = num
			//		outflow = 0.0
			//	} else {
			//		num, _ := strconv.ParseFloat(text[9:len(text)], 64)
			//		outflow = num
			//		inflow = 0.0
			//	}
			//}
			//if strings.Contains(text, "<NAME>"){
			//	payee = text[6:len(text)]
			//}
		case xml.EndElement:
			// If we just read a StartElement token
			inElement = se.Name.Local
			// ...and its name is "page"
			if inElement == "STMTTRN" {
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

	log.Println(v.Transactions)
	//log.Println(o.Insert(importData))
}
