#!/usr/bin/env bash
watchify -v -t [ babelify ] static/js/main.js -o static/js/bundle.js
