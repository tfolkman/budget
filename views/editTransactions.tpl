<!DOCTYPE html>
<html lang="{{ with .Site.LanguageCode }}{{ . }}{{ else }}en-US{{ end }}">
    <head>
        {{ template "head.html" }}
    </head>
    <body>
    <div class="container">
        {{ template "nav.html" }}
		<div id="transactions"></div>
	</div>
	<script src="/static/js/editTransactions.js"></script>
    </body>
</html>
