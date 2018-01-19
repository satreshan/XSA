var conn = $.db.getConnection();
var fs = $.require('fs');
var dict_content = fs.readFileSync('data/dict1.txt','utf8');

var sql = 'SELECT * FROM "myapp.db::text_test2"';
var stmt = conn.prepareStatement(sql);
var data = [];
var rs = stmt.executeQuery();
while (rs.next()) {
	var row = {
	  id: rs.getInt(1),
	  value: rs.getNString(2)
	};
	data.push(row);
}

var xsenv = $.require("@sap/xsenv");
var hana_service = xsenv.getServices({ hana: {tag: "hana"} });
var schema = hana_service.hana.schema;
sql = 'CALL "myapp.db::createDictionaries"(?,?,?)';
var call = conn.prepareCall(sql);
call.setString(1,schema);
call.setString(2,'customdict1');
call.setString(3,dict_content);
call.execute();
conn.commit();
$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(data) + '\n\n' + dict_content + '\n\n' +schema);