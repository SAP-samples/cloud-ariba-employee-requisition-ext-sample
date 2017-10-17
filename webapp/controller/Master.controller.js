sap.ui.define([
	"com/sap/aribaemployeerequisition/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device"
], function(BaseController, JSONModel, History, Filter, FilterOperator, Device) {
	"use strict";

	return BaseController.extend("com.sap.aribaemployeerequisition.controller.Master", {
		
			onInit: function() {
				
				this._oList = this.byId("list");
				var	oViewModel = this._createViewModel();
				
				// keeps the filter and search state
				this._oListFilterState = {
					aFilter : [],
					aSearch : []
				};
			
				this.setModel(oViewModel, "masterView");

				var me = this;
				this._oList.attachEventOnce("updateFinished", function(oEvent){
					me.selectFirstItem();
				});
				
			},
			
			//Event handler for the master search field. Applies current
			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					this.onRefresh();
					return;
				}

				var sQuery = oEvent.getParameter("query");

				if (sQuery) {
					this._oListFilterState.aSearch = [new Filter("ShortName", FilterOperator.Contains, sQuery)];
				} else {
					this._oListFilterState.aSearch = [];
				}
				this._applyFilterSearch();

			},
			
			//Event handler for refresh event.
			onRefresh : function () {
				this._oList.getBinding("items").refresh();
				this.getOwnerComponent().getCatalogItems();                         
			},
			
			//sets the first item of the list as the selected item
			selectFirstItem: function() {
				var oList = this.getView().byId("list");
				var aItems = oList.getItems();
				if (aItems.length) {
					oList.setSelectedItem(aItems[0], true, true);
					this._selectedItemIdx = 0;
				}
			},
		
			//Event handler for the list selection event
			onSelectionChange : function (oEvent) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			},
			
			//After list data is available, this handler method updates the
			//master list counter and hides the pull to refresh control, if
			onUpdateFinished : function (oEvent) {
				// update the master list object counter after new data is loaded
				this._updateListItemCount(oEvent.getParameter("total"));
				// hide pull to refresh if necessary
				this.byId("pullToRefresh").hide();
			},
			
			//Sets the item count on the master list header
			_updateListItemCount : function (iTotalItems) {
				var sTitle;
				// only update the counter if the length is final
				if (this._oList.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
					this.getModel("masterView").setProperty("/title", sTitle);
				}
			},
			
			//Shows the selected item on the detail page
			_showDetail : function (oItem) {
				var bReplace = !Device.system.phone;
				this.getRouter().navTo("object", {
					objectPath : oItem.getBindingContextPath().split("/")[2]
				}, bReplace);
			},
			
			//create a model used to display specific fields of the view
			_createViewModel : function() {
				return new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					title: this.getResourceBundle().getText("masterTitleCount", [0]),
					noDataText: this.getResourceBundle().getText("masterListNoDataText"),
					sortBy: "ChangedAt",
					groupBy: "None"
				});
			},
			
			//Internal helper method to apply both filter and search state together on the list binding
			_applyFilterSearch : function () {
				var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
					oViewModel = this.getModel("masterView");
				this._oList.getBinding("items").filter(aFilters, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (aFilters.length !== 0) {
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
				} else if (this._oListFilterState.aSearch.length > 0) {
					// only reset the no data text to default when no new search was triggered
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
				}
			}
	});
});