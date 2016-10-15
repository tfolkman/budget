<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
		{{ template "head.html" }}
</head>
    <body>
    <div class="container">
        {{ template "nav.html" }}

        <div class="row">
            <div class="col-sm-12">
                <form name="upload" id="upload" action="/confirm_import" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputFile">Upload qfx files</label>
                        <input type="file" id="importData" name="importData" accept=".qfx">
                    </div>
                    <button id="upload-file-btn" type="submit" class="btn btn-default">Submit</button>
                </form>
            </div>
        </div>
    </div>
    </body>
</html>
