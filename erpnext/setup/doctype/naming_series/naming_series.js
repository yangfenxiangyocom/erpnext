// Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

cur_frm.cscript.onload_post_render = function(doc, cdt, cdn) {
	return cur_frm.call({
		doc: cur_frm.doc,
		method: 'get_transactions',
		callback: function(r) {
			cur_frm.cscript.update_selects(r);
			cur_frm.cscript.select_doc_for_series(doc, cdt, cdn);
		}
	});
}

cur_frm.cscript.update_selects = function(r) {

	//prepare translation fix
	messages_trans = {
						'<div class="well"><br>Edit list of Series in the box below. Rules:<br><ul><br><li>Each Series Prefix on a new line.</li><li>Allowed special characters are "/" and "-"</li><li>Optionally, set the number of digits in the series using dot (.) followed by hashes (#). For example, ".####" means that the series will have four digits. Default is five digits.</li></ul>Examples:<br>INV-<br>INV-10-<br>INVK-<br>INV-.####<br></div>':'<div class="well"><br>编辑如下规则. 规则如下:<br><ul><br><li>每一个前缀新开一行.</li><li>允许的字符包括 "/" 和 "-"</li><li>数字部分用#说明,例如####代表4位数字,需以.开头, 默认为5位数字.</li></ul>例如:<br>INV-<br>INV-10-<br>INVK-<br>INV-.####<br></div>'
					};
	$.extend(frappe._messages, messages_trans);

	set_field_options('select_doc_for_series', r.message.transactions);
	set_field_options('prefix', r.message.prefixes);
}

cur_frm.cscript.select_doc_for_series = function(doc, cdt, cdn) {
	cur_frm.toggle_display(['help_html','set_options', 'user_must_always_select', 'update'], 
		doc.select_doc_for_series);

	var callback = function(r, rt){
		locals[cdt][cdn].set_options = r.message;
		refresh_field('set_options');
		if(r.message && r.message.split('\n')[0]=='')
			cur_frm.set_value('user_must_always_select', 1);
	}

	if(doc.select_doc_for_series)
		return $c_obj(doc,'get_options','',callback);
}

cur_frm.cscript.update = function() {
	return cur_frm.call_server('update_series', '', cur_frm.cscript.update_selects);
}

cur_frm.cscript.prefix = function(doc, dt, dn) {
	return cur_frm.call_server('get_current', '', function(r) {
		refresh_field('current_value');
	});
}