package qfx

import (
	"log"
	"bufio"
	"os"
)

func ReadQfx(fileName string) {
	file, err := os.Open(fileName)
        if err != nil {
            log.Fatal(err)
        }
        defer file.Close()

        scanner := bufio.NewScanner(file)
        for scanner.Scan() {
            log.Println(scanner.Text())
        }

        if err := scanner.Err(); err != nil {
            log.Fatal(err)
        }
}
