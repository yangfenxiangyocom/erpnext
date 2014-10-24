// Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

function SMSManager(doc) {
	var me = this;
	//prepare translation fix
	messages_trans = {
					'Your enquiry has been logged into the system. Ref No:':"您的信息已经记录到系统中,记录号:",
					'Quotation:':"报价单:",
					' has been sent via email. Thanks!':"已经经由邮件发出,谢谢",
					"Sales Order:":"销售订单",
					" has been created against ":"已经创建",
					"Quote No:":"报价单号",
					" for your PO: ":"采购订单:",
					"Items has been delivered against delivery note:":"发货单商品已经发货:",
					"Invoice:":"发票",
					"Items has been delivered against delivery note:":"发货单商品已经发货:",
					"Material Request:":"物料需求",
					" has been raised in the system":"已记录在系统中",
					"Purchase Order:":"采购订单:",
					"Items has been received against purchase receipt:":"收货单上的商品已经进行收货:"
					};
	$.extend(frappe._messages, messages_trans);
	
	this.setup = function() {
		var default_msg = {
			'Lead'				: '',
			'Opportunity'			: __('Your enquiry has been logged into the system. Ref No:' )+ doc.name,
			'Quotation'			: __('Quotation:') + doc.name + __(' has been sent via email. Thanks!'),
			'Sales Order'		: __('Sales Order:') + doc.name + __(' has been created against ')
						+ (doc.quotation_no ? (__('Quote No:') + doc.quotation_no) : '')
						+ (doc.po_no ? (__(' for your PO: ') + doc.po_no) : ''),
			'Delivery Note'		: __('Items has been delivered against delivery note:')+ doc.name
						+ (doc.po_no ? (__(' for your PO: ') + doc.po_no) : ''),
			'Sales Invoice': __('Invoice:') + doc.name + __(' has been sent via email. Thanks!')
						+ (doc.po_no ? (__(' for your PO: ') + doc.po_no) : ''),
			'Material Request'			: __('Material Request:') + doc.name + __(' has been raised in the system'),
			'Purchase Order'	: __('Purchase Order:') + doc.name + __(' has been sent via email. Thanks!'),
			'Purchase Receipt'	: __('Items has been received against purchase receipt:') + doc.name
		}

		if (in_list(['Quotation', 'Sales Order', 'Delivery Note', 'Sales Invoice'], doc.doctype))
			this.show(doc.contact_person, 'customer', doc.customer, '', default_msg[doc.doctype]);
		else if (in_list(['Purchase Order', 'Purchase Receipt'], doc.doctype))
			this.show(doc.contact_person, 'supplier', doc.supplier, '', default_msg[doc.doctype]);
		else if (doc.doctype == 'Lead')
			this.show('', '', '', doc.mobile_no, default_msg[doc.doctype]);
		else if (doc.doctype == 'Opportunity')
			this.show('', '', '', doc.contact_no, default_msg[doc.doctype]);
		else if (doc.doctype == 'Material Request')
			this.show('', '', '', '', default_msg[doc.doctype]);

	};

	this.get_contact_number = function(contact, key, value) {
		frappe.call({
			method: "erpnext.setup.doctype.sms_settings.sms_settings.get_contact_number",
			args: {
				contact_name:contact,
				value:value,
				key:key
			},
			callback: function(r) {
				if(r.exc) { msgprint(r.exc); return; }
				me.number = r.message;
				me.show_dialog();
			}
		});
	};

	this.show = function(contact, key, value, mobile_nos, message) {
		this.message = message;
		if (mobile_nos) {
			me.number = mobile_nos;
			me.show_dialog();
		} else if (contact){
			this.get_contact_number(contact, key, value)
		} else {
			me.show_dialog();
		}
	}
	this.show_dialog = function() {
		if(!me.dialog)
			me.make_dialog();
		me.dialog.set_values({
			'message': me.message,
			'number': me.number
		})
		me.dialog.show();
	}
	this.make_dialog = function() {
		var d = new frappe.ui.Dialog({
			title: __('Send SMS'),
			width: 400,
			fields: [
				{fieldname:'number', fieldtype:'Data', label:__('Mobile Number'), reqd:1},
				{fieldname:'message', fieldtype:'Text', label:__('Message'), reqd:1},
				{fieldname:'send', fieldtype:'Button', label:__('Send')}
			]
		})
		d.fields_dict.send.input.onclick = function() {
			var btn = d.fields_dict.send.input;
			var v = me.dialog.get_values();
			if(v) {
				$(btn).set_working();
				frappe.call({
					method: "erpnext.setup.doctype.sms_settings.sms_settings.send_sms",
					args: {
						receiver_list: [v.number],
						msg: v.message
					},
					callback: function(r) {
						$(btn).done_working();
						if(r.exc) {msgprint(r.exc); return; }
						me.dialog.hide();
					}
				});
			}
		}
		this.dialog = d;
	}
	this.setup();
}
