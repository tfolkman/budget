package qfx

import (
	"log"
	"bufio"
	"os"
	"strings"
	"time"
	"strconv"
)

func ReadQfx(fileName string) {
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
		if text == "</STMTTRN>"{
			log.Println(credit)
			log.Println(date)
			log.Println(inflow)
			log.Println(outflow)
			log.Println(payee)
			log.Println(text)
		}
        }

        if err := scanner.Err(); err != nil {
            log.Fatal(err)
        }
}
