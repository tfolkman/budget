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
	//var trnType string
	//var datePosted string
	//var trnAmt float64
	//var name string
	for {
		// Read tokens from the XML document in a stream.
		t, _ := decoder.RawToken()
		log.Println(t)
		if t == nil {
			break
		}
		switch se := t.(type) {
		case xml.EndElement:
			// If we just read a StartElement token
			inElement = se.Name.Local
			// ...and its name is "page"
			if inElement == "STMTTRN" {
				log.Println(inElement)
			}
		default:
		}
	}

	log.Println(v.Transactions)
	//log.Println(o.Insert(importData))
}
