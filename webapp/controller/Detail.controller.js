sap.ui.define([
		"com/sap/aribaemployeerequisition/controller/BaseController",
		"sap/ui/model/json/JSONModel"
	], function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("com.sap.aribaemployeerequisition.controller.Detail", {

			onInit : function () {

				var oViewModel = new JSONModel({
					busy : false,
					delay : 0
				});
				
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				this.getView().setModel(oViewModel, "detailView");

				var oForm = this.getView().byId("orderDetailsPanel");

				oForm.bindElement({path: "/", model: "oRequestModel"});
				
			},

			//create an object to contain the cart item data
			createCartItem: function(){
				var cartData = {
					Quantity: 0,
					ShortName: "",
					BillingAddress: {
						UniqueName: "SHARE:US001"	
					},
					Description: {
						ClassificationCode: {
							Value: 0,
							Domain: ""
						},
						Description : "",
						ManufacturerPartId: 0,
						Price: {
							Amount: 0,
							Currency: {
								UniqueName: "USD"
							}
						},
						SupplierPartNumber: 0,
						UnitOfMeasure: {
							UniqueName: ""
						}
					},
					ImportedDeliverToStaging: "Hana Cloud",
					ImportedNeedByStaging: "2017-04-12T06:32:37.396Z",
					NumberInCollection: "12948",
					OriginatingSystemLineNumber: "12961",
					SupplierName: "",
					ShipToName: "SHARE:KUNY00"
				};
				
				return cartData;
			},
			
			//adds an item into the cart
			onAddToCart: function(){
				var oCatalogModel = this.getView().getModel("catalogItems");
				var sPath = this.getView().getObjectBinding("catalogItems").getPath();
				var oCartModel = this.getOwnerComponent().getModel("oCartModel");
				var appViewModel = this.getOwnerComponent().getModel("appView");
				var cartItems = oCartModel.getProperty("/items");
				var data = this.createCartItem();
				
				data.Description.ClassificationCode.Domain = oCatalogModel.getProperty(sPath + "/ClassificationCode/item/Domain");
				data.Description.ClassificationCode.Value = oCatalogModel.getProperty(sPath + "/ClassificationCode/item/Value");
				data.Description.Description =oCatalogModel.getProperty(sPath + "/Description");
				data.Description.ManufacturerPartId = oCatalogModel.getProperty(sPath + "/ManufacturerPartId");
				data.Description.ManufacturerPartId = oCatalogModel.getProperty(sPath + "/ManufacturerPartId");
				data.Description.Price.Amount = oCatalogModel.getProperty(sPath + "/Price/Amount");
				data.Description.Price.Currency.UniqueName = oCatalogModel.getProperty(sPath + "/Price/Currency");
				data.Description.SupplierPartNumber = oCatalogModel.getProperty(sPath + "/SupplierPartId");
				data.Description.UnitOfMeasure.UniqueName = oCatalogModel.getProperty(sPath + "/UnitOfMeasure/Value");
				data.SupplierName = oCatalogModel.getProperty(sPath + "/SupplierName");
				data.OriginatingSystemLineNumber = oCatalogModel.getProperty(sPath + "/OriginatingLineNumber");
				data.ShortName = oCatalogModel.getProperty(sPath + "/ShortName");
				data.Quantity = this.getView().byId("quantityInp").getValue();	
				data.ShipToName = this.getView().byId("shipToNameInp").getValue();	
				
				cartItems.push(data);
				oCartModel.setProperty("/items", cartItems);
				
				appViewModel.setProperty("/cartCount", cartItems.length);

			},
			
			//navigates to the cart view
			openCart: function(){
				this.getRouter().navTo("cart");
			},

			//Binds the view to the object path
			_onObjectMatched : function (oEvent) {
				var sObjectPath =  oEvent.getParameter("arguments").objectPath;
				this._bindView(sObjectPath);
			},


			//Binds the view to the object path. Makes sure that detail view displays
			_bindView : function (sObjectPath) {

				var oViewModel = this.getModel("detailView");
				var oCatalogModel = this.getView().getModel("catalogItems");
				
				oViewModel.setProperty("/busy", false);
				this.getView().bindElement({
					path : "catalogItems>/item/" + sObjectPath
				});

			},
			
			//processes the press event of a url
			handleLinkObjectAttributePress : function (oEvent) {
				sap.m.URLHelper.redirect(oEvent.getSource().getText(), true);
			}

		});

	}
);