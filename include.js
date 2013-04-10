
    var socket;
    var firstconnect = true;
    var custID;
    var custInfo;
    var customerList = new Array();
    function connect(page) {
      if(firstconnect) {
        socket = io.connect(null);
        switch (page) {
          case "customer":
            socket.on('retrieveCustData', function (ID, cust, time) {
              addCustomerData(ID, cust, time);
              custInfo = cust;
            });
            socket.on('retrieveCustID', function(ID) { 
              custID = ID;
              socket.emit("getCustData",custID);
            });
            socket.emit('getCustomerID');
            break;
          case "index":
            socket.on('removeCustomerFromFeed', function(ID) {removeCustomerFromFeed(ID);});
            socket.on('addCustomerToFeed', function(ID, cust, time) {addCustomerToFeed(ID, cust, time);});
            socket.on('isHelped',function(ID, helped){changeHelped(ID,helped); });
            //get list of customers from the database for the seaarch page in an array of customers
            //socket.on('retrieveCustomerListFromDB', function(custlist){displayListOfCustomers(custlist)});
            socket.on('retrieveCustomerListFromFeed', function(list) {
              for (var cust in list) {
                addCustomerToFeed(list[cust].cust.personalID, list[cust].cust, list[cust].time);
                changeHelped(list[cust].helped, list[cust].cust.personalID);
              }
            });
            socket.emit('getCustomerListFromDB');
            socket.emit('getCustomerListFromFeed');
            break;
          case "purchase_history":
            socket.on('retrieveCustData', function (ID, cust, time) {
              custInfo = cust;
              $("h1#pp").text("Past Purchases - " + cust.firstName + " " + cust.lastName);
            });
            socket.on('receiveCustPurchaseHist', function (purchaseHistArr) {
              $("#purchase_history_list").html("");
              printPurchaseHistory(purchaseHistArr);
            });
            socket.on('retrieveCustID', function(ID) { 
              custID = ID;
              socket.emit("getCustData",custID);
              socket.emit("getCustPurchaseHist",custID);
            });
            socket.emit('getCustomerID');
            break;
          case "shopping_cart":
            socket.on('receiveCustExistingCart', function(cart) {
              $("#shopping_cart_list").html("");
              displayItemsInCart(cart);
            });
            socket.on('retrieveCustID', function(ID) { 
              custID = ID;
              socket.emit('getCustExistingCart', custID);
            });
            socket.emit('getCustomerID');
            break;
          case "search":
            socket.on('retreiveCustomerListFromDB', function(custlist){
              $("#searchlist").html("");
              if (!_.isEmpty(custlist)){
                _.uniq(custlist);
                custlist.sort();
                for (var cust in custlist) {
                  addCustomerToSearchFeed(custlist[cust].custID, custlist[cust]);
                }
              }
            });
            socket.emit('getCustomerListFromDB');
            break;
          case "item_search":
            socket.on('retrieveItemAttributes', function(ID, attributelist) {
              $("ul#item"+ID).html("");
              if(!_.isEmpty(attributelist)){
                _.uniq(attributelist);
                attributelist.sort();
                for (var att in attributelist) {
                  addAttributeToItem(ID, attributelist[att].itemAttID, attributelist[att]);
                }
              }
              
            });  
            socket.on('retrieveItemListFromDB', function(itemlist){
              $("#item_searchlist").html("");
              if(!_.isEmpty(itemlist)){
                _.uniq(itemlist);
                itemlist.sort();
                for (var item in itemlist) {
                  addItemToSearchFeed(itemlist[item].itemID, itemlist[item]);
                }
              }
            });
            socket.emit('getItemListFromDB');
            break;
          case "brands":  
            socket.on('retrieveCustData', function (ID, cust, time) {
              custInfo = cust;
            });
            socket.on('retrieveCustID', function(ID) { 
              custID = ID;
              socket.emit("getCustData",custID);
            });
            socket.emit('getCustomerID');
            break;
        }
	firstconnect = false;
      }
      else {
        socket.socket.reconnect();
      }
    }
    
    function addAttributeToItem(ID, attID, attribute) {
      var $ul = $('ul#item'+ID);
      $ul.append('<li>'+attribute.color+' - '+attribute.clotheSize+'</li>').listview();
      if ($ul.hasClass('ui-listview')) {
          $ul.listview('refresh');
      } else {
          $ul.trigger('create');
      }
    }  
    
    function addItemToSearchFeed(ID, item) {
      $('#item_searchlist').append("<div data-role=\"collapsible\" data-inset\"false\"><h3 onClick=\"loadItemAttributes("+ID+")\">" + item.category + " - " + item.brand + "</h3><ul id=\"item"+ID+"\" data-role=\"listview\" data-inset=\"false\"></ul></div>").collapsibleset("refresh");
    }
    
    function loadItemAttributes(itemID) {
      socket.emit("getItemAttributes", itemID);
    }  
    
    function printPurchaseHistory(purchaseHistArr) {
      var purchaseID = -1;
      for (var i in purchaseHistArr) {
        
        var purchaseInst = purchaseHistArr[i];
        
        if(purchaseID!==purchaseInst.purchaseID){
          purchaseID = purchaseInst.purchaseID;
          $("#purchase_history_list").append("<li id=\"purchase"+purchaseInst.purchaseInstID+"\" data-role=\"list-divider\">"+purchaseInst.purchaseDate+"></li>").listview('refresh');
        }  

        $("#purchase_history_list").append("<li id=\"item"+purchaseInst.itemInstID+"\"<a href=\"#\"><h3>"+purchaseInst.category+"</h3><p><strong>"+purchaseInst.brand+"</strong></p><p>"+purchaseInst.clotheSize+"</p></a></li>").listview("refresh");
      }  
      $("#purchase_history_list").listview("refresh");
    }  
    
    function isHelped(ID){
        socket.emit('custHelped',ID);                       
    }

    function removeCustomerFromFeed(ID) {
      var node = document.getElementById('cust'+ID);
      if(node.parentNode) {
        node.parentNode.removeChild(node);
      }    
    }

    function addCustomerToFeed(ID, cust, time) {
      $('#t').prepend("<li id=\""+'cust' + ID + "\"><a onClick=\"sendIdToCustomerPage("+ID+")\" href=\"#\" data-transition=\"slide\">" + cust.firstName + " " + cust.lastName + " - " + time + "<img src = \"" + cust.picPath + "\" /></a><a onclick=\"isHelped(" + ID + ")\" href=\"#\"></a></li>").listview('refresh');
    }
    
    function addCustomerToSearchFeed(ID, cust) {
      $('#searchlist').append("<li class='customer' id=\""+'cust' + ID + "\"><a onClick=\"sendIdToCustomerPage("+ID+")\" href=\"#\">" + cust.firstName + " " + cust.lastName +"</a></li>").listview('refresh');
    }  
    
    function sendIdToCustomerPage(ID) {
      socket.emit("setCustomerID", ID);
      $.mobile.changePage( "/customer.html", {
        role: "page",
        type: "get",
        data:{ID:ID},
        transition: "slide"
      });
    }

    function idRead() {
        var idIn = document.getElementById('inputbx').value;
        socket.emit("cusEnterLeave", idIn);
        document.getElementById('inputbx').value = "";
    }

    function addCustomerData(ID, cust, time) {
	$("h1#customer").text(cust.firstName + " " + cust.lastName);
	$(".time").text("Time in Store - " + time); 
    }
    
    function loadPage(page) {
      switch (page) {
	case 'pp':
	socket.emit("setCustomerID", custID);
	$.mobile.changePage( "/purchase_history.html", {
	    role: "page",
	    type: "get",
	    data:{ID:custID},
	    transition: "slide"
	  });
	      
	  break;
	case 'size':
	 socket.emit("setCustomerID", custID);
	$.mobile.changePage( "/size.html", {
	    role: "page",
	    type: "get",
	    data:{ID:custID},
	    transition: "slide"
	  });
	  break;
	case 'brand':
	socket.emit("setCustomerID", custID);
	$.mobile.changePage( "/brands.html", {
	    role: "page",
	    type: "get",
	    data:{ID:custID},
	    transition: "slide"
	  });
	  break;
	case 'search':
	//socket.emit("getCustomerListFromDB");
	$.mobile.changePage( "/search.html", {
	    role: "page",
	    type: "get",
	    data:{ID:custID},
	    transition: "slide"
	  });
	  break;
        case 'item_search':
        //socket.emit("getItemListFromDB");
        $.mobile.changePage( "/item_search.html", {
            role: "page",
            type: "get",
            data:{ID:custID},
            transition: "slide"
          });
          break;
        case 'shopping_cart':
        socket.emit("setCustomerID", custID);
        $.mobile.changePage( "/shopping_cart.html", {
            role: "page",
            type: "get",
            data:{ID:custID},
            transition: "slide"
          });
          break;
     }
      
    }
    
function sendIdToCustomerPage(ID) {
	socket.emit("setCustomerID", ID);
	$.mobile.changePage( "/customer.html", {
	role: "page",
	type: "get",
	data:{ID:ID},
	transition: "slide"
	});
}


function changeHelped (helped, ID){
	if (helped){
		$("#cust" + ID + " .ui-li").css("background-color","yellow");
		$("#cust" + ID).addClass("helped");

	}
	else {
		$("#cust" + ID + " .ui-li").css("background-color", "#EEEEEE");	
		$("#cust" + ID).removeClass("helped");
	}

	}