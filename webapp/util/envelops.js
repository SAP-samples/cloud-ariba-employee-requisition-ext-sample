sap.ui.define([], function() {
	"use strict";

	return {


		catalogItemSearchEnvelope: function(field, operator, items, userId){
			var itemsValue = "";
			
			$.each(items, function( idx, value ) {
			  itemsValue += "<item>" + value + "</item>";
			});
			
			var Envelope = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
			    "<Body>" +
			        "<WSCatalogItemSearchRequest xmlns=\"urn:Ariba:Buyer:vrealm_3\">" +
			            "<WSCatalogSearchQueryRequest_Item>" +
			                "<item>" +
			                    "<SearchTerms>" +
			                        "<item>" +
			                            "<Field>" + field + "</Field>" +
			                            "<Operator>" + operator + "</Operator>" +
			                            "<Values>" +
			                                itemsValue +
			                            "</Values>" +
			                        "</item>" +
			                    "</SearchTerms>" +
			                    "<Sort></Sort>" +
			                    "<SortDirection></SortDirection>" +
			                    "<UserId>" + userId + "</UserId>" +
			                "</item>" +
			            "</WSCatalogSearchQueryRequest_Item>" +
			        "</WSCatalogItemSearchRequest>" +
			    "</Body>" +
			"</Envelope>";
			
			return Envelope;
		},
		
		procurmentRequestEnvelop: function(header, data){
			var orgSysRefId = "CP" + new Date().getTime();
			
			var items = this._procurmentRequestItem(header, data);
			
			var Envelope = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:Ariba:Buyer:vrealm_3\">" +
			   "<soapenv:Header>" +
			      "<urn:Headers>" +
			         "<urn:variant>vrealm_3</urn:variant>" +
			         "<urn:partition>prealm_3</urn:partition>" +
			      "</urn:Headers>" +
			   "</soapenv:Header>" +
			   "<soapenv:Body>" +
			      "<urn:RequisitionImportPullRequest partition=\"prealm_3\" variant=\"vrealm_3\">" +
			         "<urn:Requisition_RequisitionImportPull_Item>" +
						items +
			         "</urn:Requisition_RequisitionImportPull_Item>" +
			      "</urn:RequisitionImportPullRequest>" +
			   "</soapenv:Body>" +
			"</soapenv:Envelope>";
			
			return Envelope;
		},
		
		_procurmentRequestItem: function(header, items){
			var requestItems = "";
			var requestLineItems = this.procurmentRequestLineItem(items);
			var orgSysRefId = "CP" + new Date().getTime();
			var requestItems = 
						   "<urn:item>" +
			               "<urn:ImportedHeaderCommentStaging>" + header.ImportedHeaderCommentStaging + "</urn:ImportedHeaderCommentStaging>" +
			               "<urn:ImportedHeaderExternalCommentStaging>" + header.ImportedHeaderExternalCommentStaging + "</urn:ImportedHeaderExternalCommentStaging>" +
			               "<urn:LineItems>" +
								requestLineItems +
			               "</urn:LineItems>" +
			               "<urn:Name>" + header.Name + "</urn:Name>" +
			               "<urn:OriginatingSystem>" + header.OriginatingSystem +"</urn:OriginatingSystem>" +
			               "<urn:OriginatingSystemReferenceID>"+ orgSysRefId +"</urn:OriginatingSystemReferenceID>" +
			               "<urn:Preparer>" +
			                  "<urn:PasswordAdapter>" + header.Preparer.PasswordAdapter + "</urn:PasswordAdapter>" +
			                  "<urn:UniqueName>" + header.Preparer.UniqueName + "</urn:UniqueName>" +
			               "</urn:Preparer>" +
			               "<urn:Requester>" +
			                  "<urn:PasswordAdapter>" + header.Requester.PasswordAdapter + "</urn:PasswordAdapter>" +
			                  "<urn:UniqueName>" + header.Requester.UniqueName + "</urn:UniqueName>" +
			               "</urn:Requester>" +
			               "<urn:UniqueName>" + header.UniqueName + "</urn:UniqueName>" +
			            "</urn:item>";
			            
			return requestItems;
		},
		
		procurmentRequestLineItem: function(items){
			var requestLineItems = "";
			$.each(items, function( idx, data ) {
			  requestLineItems += 
			                  "<urn:item>" +
			                     "<urn:BillingAddress>" +
			                        "<urn:UniqueName>" + data.BillingAddress.UniqueName + "</urn:UniqueName>" +
			                     "</urn:BillingAddress>" +
			                     "<urn:CommodityCode>" +
			                        "<urn:UniqueName>" + data.Description.ClassificationCode.value + "</urn:UniqueName>" +
			                     "</urn:CommodityCode>" +
			                     "<urn:Description>" +
			                        "<urn:CommonCommodityCode>" +
			                           "<urn:Domain>" + data.Description.ClassificationCode.Domain + "</urn:Domain>" +
			                           "<urn:UniqueName>" + data.Description.ClassificationCode.Value + "</urn:UniqueName>" +
			                        "</urn:CommonCommodityCode>" +
			                        "<urn:Description>" + data.Description.Description + "</urn:Description>" +
			                        "<urn:ManPartNumber>" + data.Description.ManufacturerPartId + "</urn:ManPartNumber>" +
			                        "<urn:Price>" +
			                           "<urn:Amount>" + data.Description.Price.Amount + "</urn:Amount>" +
			                           "<urn:Currency>" +
			                              "<urn:UniqueName>" + data.Description.Price.Currency.UniqueName + "</urn:UniqueName>" +
			                           "</urn:Currency>" +
			                        "</urn:Price>" +
			                        "<urn:SupplierPartNumber>" + data.Description.SupplierPartNumber + "</urn:SupplierPartNumber>" +
			                        "<urn:UnitOfMeasure>" +
			                           "<urn:UniqueName>" + data.Description.UnitOfMeasure.UniqueName +"</urn:UniqueName>" +
			                        "</urn:UnitOfMeasure>" +
			                     "</urn:Description>" +
			                     "<urn:ImportedDeliverToStaging>" + data.ImportedDeliverToStaging + "</urn:ImportedDeliverToStaging>" +
			                     "<urn:ImportedLineCommentStaging/>" +
			                     "<urn:ImportedLineExternalCommentStaging>false</urn:ImportedLineExternalCommentStaging>" +
			                     "<urn:ImportedNeedByStaging>" + data.ImportedNeedByStaging + "</urn:ImportedNeedByStaging>" +
			                     "<urn:NumberInCollection>" + data.NumberInCollection + "</urn:NumberInCollection>" +
			                     "<urn:OriginatingSystemLineNumber>" + data.OriginatingSystemLineNumber + "</urn:OriginatingSystemLineNumber>" +
			                     "<urn:Quantity>" + data.Quantity +"</urn:Quantity>" +
			                     "<urn:ShipTo>" +
			                        "<urn:UniqueName>" + data.ShipToName + "</urn:UniqueName>" +
			                     "</urn:ShipTo>" +
			                     "<urn:Supplier>" +
			                        "<urn:UniqueName>" + data.SupplierName +"</urn:UniqueName>" +
			                     "</urn:Supplier>" +
			                  "</urn:item>";
			});
			
			return requestLineItems;
		}

	};
});