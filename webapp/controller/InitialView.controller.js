sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("MIA.myinboxap.controller.InitialView", {
			onInit: function () {

			},
            press:function(oEvent){

                var key = oEvent.getSource().data().key,
                oRouter = sap.ui.core.UIComponent.getRouterFor(this);               
                oRouter.navTo("DetailView",{key:key});
            }
		});
	});
