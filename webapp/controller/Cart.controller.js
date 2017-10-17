sap.ui.define([
		"com/sap/aribaemployeerequisition/controller/BaseController",
		"com/sap/aribaemployeerequisition/util/envelops",
		"sap/m/MessageBox"
], function(BaseController, envelops, MessageBox) {
	"use strict";

	return BaseController.extend("com.sap.aribaemployeerequisition.controller.Cart", {

		onInit: function () {

		},

		//navigates back to the master/detail views
		onNavButtonPress: function() {
			this.getRouter().navTo("master");
		},
		
		//set the line item total
		setLineTotal: function(quantity, price){
			var amount = quantity * price;
			this._setTotal();
			return amount.toLocaleString();
		},
		
		//provides the structure for the cart request header
		getCartHeader: function(){
			var comment = this.getView().byId("commentInp").getValue();
			var title = this.getView().byId("titleInp").getValue();
			var preparer = this.getView().byId("preparerInp").getValue();
			var requester = this.getView().byId("requesterInp").getValue();
			var cartHeader = {
				ImportedHeaderCommentStaging: comment,
				ImportedHeaderExternalCommentStaging: "false",
				Name: title,
				OriginatingSystem: "SAP Cloud Platform",
				Preparer: {
					PasswordAdapter: "PasswordAdapter1",
					UniqueName: preparer
				},
				Requester: {
					PasswordAdapter: "PasswordAdapter1",
					UniqueName: requester
				},
				UniqueName: "HCPARB_001"
			};
			
			return cartHeader;
		},
		
		//sets the total for the cart
		_setTotal: function(amount){
			var total = 0;
			var oFooter = this.getView().byId("totalFooter");
			var oCartModel = this.getView().getModel("oCartModel");
			var data = oCartModel.getProperty("/items");

			$.each(data, function( idx, value ) {
			  total += value.Quantity * value.Description.Price.Amount; 
			});

			oFooter.setNumber(total.toLocaleString());
			oFooter.setNumberUnit(data[0].Description.Price.Currency.UniqueName);
		},
		
		//submits the cart
		onSubmit: function(){
				var dataRequest, header, oCartModel, data, appViewModel, oFooter,
					me =  this,
					destination = "/AribaSOAPAPI",
					url = "/RequisitionImportPull";
				
				this.getOwnerComponent().isAppBusy(true);
				
				oCartModel = this.getView().getModel("oCartModel");
				header = this.getCartHeader();
				data = oCartModel.getProperty("/items");
				dataRequest = envelops.procurmentRequestEnvelop(header, data);
				appViewModel = this.getOwnerComponent().getModel("appView");
				oFooter = this.getView().byId("totalFooter");

				$.ajax(destination + url, {
					method: "POST",
					data: dataRequest,
					dataType: "xml",
					contentType: "text/xml; charset=\"utf-8\"",
					headers: {
						"SOAPAction": "/Process Definition"
					}
					}).success(function(req, textStatus, jqXHR) {
						var respData = req.querySelectorAll('StatusString')[0].innerHTML;
						if(respData === "Composing"){
							MessageBox.information("Your order has been submitted.", {onClose: function(){
								oCartModel.setData({"items": []});
								oFooter.setNumber(0);
								me.getRouter().navTo("master");
								appViewModel.setProperty("/cartCount", "");
							}});
						}else{
							MessageBox.error("An error occurred", {details: req});	
						}
					}).error(function(req, textStatus, errorThrown) {
						MessageBox.error("An error occurred", {details: req.responseText});
					}).complete(function(jqXHR, textStatus){
						me.getOwnerComponent().isAppBusy(false);
					});
			},
			
			//event listener which processes a change in quantity
			onQuantityChanged: function(oEvent){
				var oQtyInput = oEvent.getSource();
				var oSubmitBtn = this.byId("submit");
				var newValue = parseInt(oEvent.getParameter("newValue"),10);
				
				oQtyInput.setValue(newValue);

				if(isNaN(newValue) || newValue % 1 !== 0 || newValue < 0 || newValue === "") {
					oQtyInput.setValueState("Error");
					oSubmitBtn.setEnabled(false);
				}else{
					oQtyInput.setValueState();
					oSubmitBtn.setEnabled(true);
				}
			},
			
			//event listener which process a line item delete
			onDeletePressed: function(oEvent){

				var oBindingContext = oEvent.getParameter("listItem").getBindingContext("oCartModel");
				var oCartModel = oBindingContext.getModel();
				var cartItems = oCartModel.getProperty("/items");
				var sPath = oBindingContext.sPath;
				var arrIndex = sPath.match(/\d+/)[0];
				var appViewModel = this.getOwnerComponent().getModel("appView");
				
				cartItems.splice(arrIndex, 1);
				oCartModel.setProperty("/items", cartItems);
				appViewModel.setProperty("/cartCount", cartItems.length);
				
				this._setTotal();
			}
	});
});
