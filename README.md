## Budget

A simple budget application


## Getting Started

1. Have docker installed
2. Build docker image:  docker build -t budget .
3. Run docker image: docker run -it -p 8080:8080 -v "$PWD/data":/go/src/github.com/tfolkman/budget/data budget
4. Start budgeting: localhost:8080

## Road Map

1. Figure out way to sync to Dropbox
2. Add total monthly budget and spend on main page
3. QIF import for paypal
4. Dashboards

