sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/aribaemployeerequisition/model/models",
	"com/sap/aribaemployeerequisition/util/envelops",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(UIComponent, Device, models, envelops, JSONModel, MessageBox) {
	"use strict";

	return UIComponent.extend("com.sap.aribaemployeerequisition.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// create the views based on the url/hash
			this.getRouter().initialize();
			
			var oViewModel = new JSONModel({
					busy : true,
					delay : 0,
					cartCount: ""
				});
			this.setModel(oViewModel, "appView");
			
			var oCartModel = new JSONModel({
				items: []
			});
			this.setModel(oCartModel, "oCartModel");
			
			this.getCatalogItems();
		},
		
			//call catalog items service to be displayed in master list
			getCatalogItems: function(){
				this.isAppBusy(true);
				//Field, Operator, searchValues, userid 
				var envelope = envelops.catalogItemSearchEnvelope("MatchAll", "Like", [0], "ksemerdzhiev");
				var me = this;
				
				//get the data as xml so a selector can be used
				$.ajax("/AribaSOAPAPI/WSCatalogItemSearch", { 
	            	method: "POST",
	            	headers: {},
	            	data: envelope,
	            	dataType: "xml",
					contentType : "text/xml; charset=\"utf-8\""
	            }).success(function(data, textStatus, jqXHR) {
	                  me.setCatalogItemsMdl(data);
	            }).fail(function(XMLHttpRequest, textStatus) {
	                MessageBox.error(textStatus);
	                me.isAppBusy(false);
	            });
			},
			
			//set the catalogitems xml node to an xml model 
			setCatalogItemsMdl: function(data){
				var xSerializer = new XMLSerializer();
				var oModel = new sap.ui.model.xml.XMLModel();
				
				//get the catalogitems node
				data = data.querySelectorAll('CatalogItems')[0];
				//convert the document to a string
				data = xSerializer.serializeToString(data);
				oModel.setXML(data);
				this.setModel(oModel,"catalogItems");
				this.isAppBusy(false);
			},
			
			//show or hide busy indicator			
			isAppBusy: function(isBusy) {
				var oViewModel = this.getModel("appView");
				oViewModel.setProperty("/busy", isBusy);
			}
	});
});
