package main

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/mattn/go-sqlite3"
	_ "github.com/tfolkman/budget/routers"
	"github.com/tfolkman/budget/models"
	"log"
	"time"
	"os"
	"github.com/astaxie/beego/toolbox"
	"encoding/json"
	"io/ioutil"
	"github.com/tj/go-dropbox"
)

type DropboxAuth struct {
	Key string `json:"key"`
	Secret string `json:"secret"`
	Token string `json:"token"`
}

func init() {
	orm.RegisterDriver("mysql", orm.DRSqlite)
	orm.RegisterDataBase("default", "sqlite3", "./data/budget.db")
	orm.RegisterModel(new(models.Budget))
	orm.RegisterModel(new(models.Transactions))

	if _, err := os.Stat("./data/dropbox.json"); err == nil {
		log.Println("setting up task...")
		tk1 := toolbox.NewTask("tk1", "0/15 * * * * *", func() error {
			var dropboxAuth DropboxAuth
			file, _ := ioutil.ReadFile("./data/dropbox.json")
			dbFile , _ := os.Open("./data/budget.db")
    			json.Unmarshal(file, &dropboxAuth)
			log.Println(dropboxAuth.Token)
			d := dropbox.New(dropbox.NewConfig(dropboxAuth.Token))
			_, err := d.Files.Upload(&dropbox.UploadInput{
				Path:   "budget.db",
				Reader: dbFile,
				Mute:   false,
			})
			if err != nil {
				log.Println(err)
			}
			log.Println("dropbox...")
			return nil
		})
		toolbox.AddTask("tk1", tk1)
		toolbox.StartTask()
	}
}

func main() {

	// Database alias.
	name := "default"

	// Drop table and re-create.
	force := false

	// Print log.
	verbose := true

	// Error.
	err := orm.RunSyncdb(name, force, verbose)
	if err != nil {
    		log.Println(err)
	}

	o := orm.NewOrm()
	var count int
	o.Raw("SELECT count(*) as Count from budget").QueryRow(&count)

	if count == 0 {
		currentTime := time.Now()
		m := time.Now().Month()
		budget := new(models.Budget)
		budget.Amount = 200.00
		budget.Month = int(m)
		budget.Year = currentTime.Year()
		budget.Name = "Groceries"
		o.Insert(budget)
	}

	beego.Run()

}
