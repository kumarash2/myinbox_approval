sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/Fragment"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function(Controller, Filter, FilterOperator, Fragment) {
		"use strict";

		return Controller.extend("MIA.myinboxap.controller.DetailView", {
			onInit: function() {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("DetailView").attachMatched(this._onRouteMatched, this);
			},
			onNavback: function() {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("RouteInitialView");
			},
			_onRouteMatched: function(oEvent) {
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				oView = this.getView();
                oView.byId("idTab").setSelectedKey(oArgs.key);
				/*oView.bindElement({
				    path: "/Products(" + oArgs.productId + ")",
				    events: {
				        dataRequested: function () {
				            oView.setBusy(true);
				        },
				        dataReceived: function () {
				            oView.setBusy(false);
				        }
				    }
				});*/
			},
			onSearch: function(oEvent) {
				let fBar = oEvent.getSource(),
					table = oEvent.getSource().data().id,
					fItems = fBar.getFilterGroupItems(),
					aFilters = [];
                    $.each(fItems, function(i, ele) {
                        let key = ele.getProperty('groupName'),
                            control = fBar.determineControlByFilterItem(ele),
                            oFilter = null;
                        if (control.getMetadata().getName() === 'sap.m.Input' && control.getValue() !== '') {
                            oFilter = new Filter(key, FilterOperator.EQ, control.getValue());
                        } else if (control.getMetadata().getName() === 'sap.m.DatePicker' && control.getValue() !== '') {
    
                        }
                        if (oFilter !== null)
                            aFilters.push(oFilter);
                    });
				table.getBinding('items').filter(aFilters, "Application");

			},
			/*Begin of F4 Help*/
			onPrNumberValueHelpRequest: function(oEvent) {
				this.fnCallFragment(oEvent, this._PRNumber, "PRnumberValueHelp");
			},
			onVendorValueHelpRequest: function(oEvent) {
				this.fnCallFragment(oEvent, this._Vendor, "VendorValueHelp");
			},
			fnCallFragment: function(oEvent, d, fName) {
				var oView = this.getView();
				if (!d) {
					d = Fragment.load({
						id: oView.getId(),
						name: "MIA.myinboxap.Fragments." + fName,
						controller: this
					}).then(function(oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}

				d.then(function(oDialog) {
					oDialog.open();
				});
			},
            onValueHelpLineItemPress:function(oEvent){
                var  src = oEvent.getSource(),
                     id = src.data().id.split("_"),
                     sObj = src.getBindingContext("valuehelp").getObject();
                this.byId(id[0]).setValue(sObj[id[1]]);
                oEvent.getSource().getParent().getParent().close();
            },
			onSearch: function(oEvent) {
                // var sValue = oEvent.getParameter("value");
                // this.fnCommonSearch(oEvent,sValue,[""]);
                let fBar = oEvent.getSource(),
					table = this.byId(oEvent.getSource().data().id),
					fItems = fBar.getFilterGroupItems(),
					aFilters = [];
				$.each(fItems, function(i, ele) {
					let key = ele.getProperty('groupName'),
						control = fBar.determineControlByFilterItem(ele),
						oFilter = null;
                      
					if (control.getMetadata().getName() === 'sap.m.Input' && control.getValue() !== '') {
						oFilter = new Filter(key, FilterOperator.EQ, control.getValue());
					} else if (control.getMetadata().getName() === 'sap.m.DatePicker' && control.getValue() !== '' && control.getValue() !== null ) {
                        oFilter = new Filter(key, FilterOperator.EQ, control.getValue());
					}
					if (oFilter !== null)
						aFilters.push(oFilter);
				});
				table.getBinding('items').filter(aFilters);
			},
           /* fnCommonSearch:function(e,v,f){
                let filters = [],
                    oBinding = e.getParameter("itemsBinding");
                    for(var i=0;i<f.length;i++){
                        filters.push(new Filter("", FilterOperator.Contains, v))
                    }                    
				oBinding.filter(filters);
            },*/
			/* End of F4 Help*/
           

			/*Begin of Cross App Navigation*/
			onPRAItemSelect: function(oEvent) {
				var PRNumber = oEvent.getParameter("listItem").getBindingContext().getObject().PRNumber;
					this.fnCrossnavigation("ZPurchaseReq", "Create", PRNumber);
			},		
            onPrLink:function(oEvent){
                    var Banfn = oEvent.getSource().getBindingContext().getObject().Banfn;
					this.fnCrossnavigation("ZPurchaseReq", "Create", Banfn,0);
            },			
			onINVAItemPress: function(oEvent) {
				var PRNumber = oEvent.getParameter("listItem").getBindingContext().getObject().PRNumber;
					this.fnCrossnavigation("ZPurchaseReq", "Create", PRNumber);
			},
		
			onCredAItemPress: function(oEvent) {
				var PRNumber = oEvent.getParameter("listItem").getBindingContext().getObject().PRNumber;
					this.fnCrossnavigation("ZPurchaseReq", "Create", PRNumber);
			},
			fnCrossnavigation: function(s, a, v,secValue) {
					/*  if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
					      var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation"); 
					      oCrossAppNav.toExternal({
					          target : { semanticObject : s, action : a },
					          //params : { PRNumber : [ PRNumber ] }
					          params:p
					      })
                      } */
                      var value = (secValue !== null && !secValue)?v+','+secValue:v;
                       var crnavi = sap.ushell.Container.getService("CrossApplicationNavigation");
					var hashUrl = (sap.ushell && sap.ushell.Container &&
						sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
							target: {
								semanticObject: s,
								action: a
							}/*,
							params: {
								"Display": value								
							}*/
                        })) || "",
                        url = hashUrl+"?sap-ui-app-id-hint=saas_approuter_zprcreatenew&/PRPreview/"+value;
                       // crnavi.toExternal({target:hashUrl})
                       sap.m.URLHelper.redirect(url,true);
				},
				/* End of Cross App Navigation*/
                OnCloseDialog:function(e){
                        e.getSource().getParent().close();
                }
		});
	});