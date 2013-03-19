
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
            socket.emit('getCustomerID');
            socket.on('retrieveCustData', function (ID, cust, time) {
              addCustomerData(ID, cust, time);
              custInfo = cust;
            });
            socket.on('retrieveCustID', function(ID) { 
              custID = ID;
              socket.emit("getCustData",custID);
            });
            break;
          case "index":
            socket.on('removeCustomerFromFeed', function(ID) {removeCustomerFromFeed(ID);});
            socket.on('addCustomerToFeed', function(ID, cust, time) {addCustomerToFeed(ID, cust, time);});
            socket.on('isHelped',function(ID, helped){changeHelped(ID,helped); });
            //get list of customers from the database for the seaarch page in an array of customers
            // socket.on('retrieveCustomerListFromDB', function(custlist){displayListOfCustomers(custlist)});
            socket.on('retrieveCustomerListFromFeed', function(list) {
              for (var cust in list) {
                addCustomerToFeed(list[cust].cust.empID, list[cust].cust, list[cust].time);
              }
            });
            socket.emit('getCustomerListFromFeed');
            break;
          case "purchase_history":
            //set up
            break;
        }
	firstconnect = false;
      }
      else {
        socket.socket.reconnect();
      }
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
      $('#t').prepend("<li id=\""+'cust' + ID + "\"><a onClick=\"sendIdToCustomerPage("+ID+")\" href=\"#\" data-transition=\"slide\">" + cust.firstName + " " + cust.lastName + " - " + time + "<img src = \"" + cust.picture + "\" /></a><a onclick=\"isHelped(" + ID + ")\" href=\"#\"></a></li>").listview('refresh');
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
	$("h1").text(cust.firstName + " " + cust.lastName);
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
	socket.emit("getCustomerListFromDB");
	$.mobile.changePage( "/search.html", {
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