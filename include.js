
	//begin client-side code

    var socket;
    var firstconnect = true;
    var custID;
    var custInfo;
    var customerList = new Array();
    var existingCart = new Array();
	//code to run when a new page is loaded
    function connect(page) {
      if(firstconnect) {
        socket = io.connect(null);
		//switch statement for the page being loaded
		//each page will have emits and listeners, mostly set in a hierarchical manner
		//so that some data isn't collected into other data is made availible to it.
        switch (page) {
          case "customer":
			socket.once('retrieveTotalAmntFromDB', function (total) {convertTotalAmntToPoints(total); });
            socket.once('retrieveCustData', function (ID, cust, time) {
				addCustomerData(ID, cust, time);
				custInfo = cust;
				socket.emit("getRank",ID);
            });
            socket.once('retrieveCustID', function(ID) { 
              custID = ID;
              socket.emit("getCustData",custID);
            });
            socket.emit('getCustomerID');
            break;
          case "index":
            socket.on('alert', function(message) {console.log("he says " + message);});
            socket.on('removeCustomerFromFeed', function(ID) {removeCustomerFromFeed(ID);});
            socket.on('addCustomerToFeed', function(ID, cust, time) {addCustomerToFeed(ID, cust, time);});
            socket.on('isHelped',function(ID, helped){changeHelped(ID,helped); });
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
            socket.once('retrieveCustData', function (ID, cust, time) {
              custInfo = cust;
              $("h1#pp").text("Past Purchases - " + cust.firstName + " " + cust.lastName);
            });
            socket.once('receiveCustPurchaseHist', function (purchaseHistArr) {
              $("#purchase_history_list").html("");
              printPurchaseHistory(purchaseHistArr);
            });
            socket.once('retrieveCustID', function(ID) { 
              custID = ID;
              socket.emit("getCustData",custID);
              socket.emit("getCustPurchaseHist",custID);
            });
            socket.emit('getCustomerID');
            break;
          case "shopping_cart":
            socket.on('addToCart',function(item){addItemToCart(item);});
            socket.once('receiveCustExistingCart', function(cart) {
                $("#shopping_cart_list").html("");
                displayItemsInCart(cart,custID);
                if(_.isEmpty(cart)){
                  $("a#checkout_button").addClass("ui-disabled");
                  $("#shopping_cart_list").append("<li id=\"empty_message\">Shopping cart is empty. Add items</li>").listview('refresh');
                } else {
                  $("a#checkout_button").removeClass("ui-disabled");
                }  
              
            });
            socket.once('retrieveCustID', function(ID) {
              custID = ID;
              socket.emit('getCustExistingCart', custID);
            });
            socket.emit('getCustomerID');
            break;
          case "search":
            socket.once('retreiveCustomerListFromDB', function(custlist){
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
            socket.once('receiveCustExistingCart', function(cart) {
              existingCart = cart;
            });    
            socket.once('retrieveItemListFromDB', function(itemlist){
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
            socket.emit('getCustExistingCart', custID);
            break;
          case "brands":  
            socket.once('retrieveCustData', function (ID, cust, time) {
              custInfo = cust;
	       $("h1#pp").text("Past Purchases - " + cust.firstName + " " + cust.lastName);
            });
            socket.once('retrieveCustID', function(ID) { 
              custID = ID;
              socket.emit("getCustData",custID);
	      socket.emit('getBrandListFromDB',custID);
            });
	    socket.on('retreiveBrandData',function(brands){createBrandPieChart(brands);});
            socket.emit('getCustomerID');
            break;
	  case "size":  
	    socket.once('retrieveCustData', function (ID, cust, time) {
	       addCustomerData(ID, cust, time);
	      custInfo = cust;
	    });
	    socket.once('retrieveCustID', function(ID) { 
	      custID = ID;
	      socket.emit("getCustData",custID);
	    });
	    socket.once("retrieveSizeFromDB",function(size){addSize(size);});
	    socket.emit("getCustomerSizeFromDB",custID);
	    socket.emit('getCustomerID');
	  break;
	  case "checkout":
	    socket.once('retrieveCustData', function (ID, cust, time) {
	      custInfo = cust;
              socket.emit('getCustExistingCart', custID, "checkout");
	    });
	    socket.emit('getCustomerID');
	    
	    socket.once('receiveCustExistingCart', function(cart) {
             
              $("#checkout_list").html("");
	      var totalPrice = 0;
	      var numItems = 0;
	      for (var i in cart){
                for (var j in cart[i]){
		  totalPrice+= cart[i][j].quantity * cart[i][j].price;
		  numItems+= cart[i][j].quantity;
                }
              }
              displayItemsForCheckout(cart,custID,totalPrice,numItems);
              if (_.isEmpty(cart)==false){
                socket.emit('setPurchaseInst',custID,totalPrice,numItems,cart);
                socket.emit('resetCustCart',custID);
              }
              
            });
	    
	    socket.once('retrieveCustID', function(ID) { 
	      custID = ID;
	      socket.emit("getCustData",custID);
              
	    });
	    
	    
	  break;
        }
	firstconnect = false;
      }
      else {
        socket.socket.reconnect();
      }
    }
    
	//converts the total purchase amount to points and gives the customer a rank
    function convertTotalAmntToPoints(total){
		if (total<1000){
			$("h1#customer").append(" - Normal");
		} else if (total<2000){
                        $("h1#customer").append(" - Valued");
                } else if (total<5000){
                        $("h1#customer").append(" - VIP");
                } else
                        $("h1#customer").append(" - Executive");
    }
	
	//consults google charts and creates a pretty-printed graph of the customer's brand choices
    function createBrandPieChart(brands){
        var brandLabels = "";
        var brandData = "";
        var i = 0;
        console.log(brands);
        for (var brand in brands) {
          if(i==0) {
            brandData += brands[brand];
            brandLabels += brand;
          } else {
            brandData += (","+brands[brand]);
            brandLabels += ("|"+brand);
          }
          i++;  
        }
          console.log(brandData);
          console.log(brandLabels);
          $("#chart_div").html("<img src=\"//chart.googleapis.com/chart?chf=bg,s,67676700&chs=500x300&cht=p&chd=t:"+brandData+"&chds=a&chl="+brandLabels+"\" width=\"auto\" height=\"300\" alt=\"\" />");
    }
    
	//adds size to the customer's information
    function addSize(size){
		if(size[0].shirtSize!==null){
			$("#shirt_size").append("<h1>"+size[0].shirtSize+"</h1>");
		} else {
			$("#shirt_size").append("<h1>N/A</h1>");
		}
		if(size[0].pantSize!==null){
			$("#pant_size").append("<h1>"+size[0].pantSize+"</h1>");
		} else {
			$("#pant_size").append("<h1>N/A</h1>");
		}
		if(size[0].dressSize!==null){
			$("#dress_size").append("<h1>"+size[0].dressSize+"</h1>");
		} else {
			$("#dress_size").append("<h1>N/A</h1>");
		}
    }
    
	//displays checkout page and the items purchased
    function displayItemsForCheckout(cart,custID,totalPrice,numItems){
		  if (_.isEmpty(cart)== false){
		$("#checkout_list").append("<h3 style='text-align: center; background-color:#BABABA'>Your order has been processed!</h3>").listview('refresh');}
		  for (var i in cart){
		for (var j in cart[i]){
				$("#checkout_list").append("<li id=\""+'item' + cart[i][j].itemID +'_itemAtt'+cart[i][j].itemAttID+ "\">" + cart[i][j].category + " - " + cart[i][j].brand + ":  "+ cart[i][j].clotheSize + " ,  " + cart[i][j].color + "    $" + cart[i][j].price +"  Quantity: "+ cart[i][j].quantity+ "</li>").listview('refresh');
		}
		  }//end for
		  $("#checkout_list").append("<br/><br/><span id='total'><u>Number of Items:</u><b> "+ numItems +"</b><br/><br/><u>Total Price:</u><b>$"+ totalPrice +"<b></span>").listview('refresh');
    }
	
	//removes an items from the current shopping cart
    function removeItemFromCart(itemID,itemAttID,custID){
      //implement remove item from cart
      console.log(itemID + ", " + itemAttID + ", " + custID);
      
      var node = document.getElementById('item' + itemID +'_itemAtt'+itemAttID);
      if(node.parentNode) {
		var theParent = node.parentNode;
        theParent.removeChild(node);
		if(!theParent.hasChildNodes()) {
			$("a#checkout_button").addClass("ui-disabled");
            $("#shopping_cart_list").append("<li id=\"empty_message\">Shopping cart is empty. Add items</li>").listview('refresh');
		}
      }
      socket.emit('removeItemFromCart',itemID,itemAttID,custID);
    }
    var plus = "plus";
    var minus = "minus";
    
	
	//adds an item from the item search page to the current shopping cart
    function addItemToCart(item,custID){
     
     // $("#shopping_cart_list").append("<li id=\""+'item' + item[0].itemID +'_itemAtt'+item[0].itemAttID+ "\"><a href=\"#\">" + item[0].category + " - " + item[0].brand + ":  "+ item[0].clotheSize + " ,  " + item[0].color + "    $" + item[0].price +"</a><button onClick=\"changeQuantityVal("+item[0].itemID+","+item[0].itemAttID+","+plus+")\" id=\"item" + item[0].itemID + "itemAttID"+item[0].itemAttID+"_plus\" data-inline=\"true\">+</button><input type=\"text\" id=\"item" + item[0].itemID + "itemAttID"+item[0].itemAttID+"_num\" value=\""+item[0].quantity+"\" disabled=\"disabled\" /><button onClick=\"changeQuantityVal("+item[0].itemID+","+item[0].itemAttID+","+minus+")\" id=\"item" + item[0].itemID + "itemAttID"+item[0].itemAttID+"_minus\" data-inline=\"true\">-</button><a onClick=\"removeItemFromCart("+item[0].itemID + ", " + item[0].itemAttID + ", " + custID + ","+ item[0].price +")\" href=\"#\"></a></li>").listview('refresh');
      changeItemAdded(item[0],custID);
    }
    
	//adjust the visual representation of an item after it is added
    function changeItemAdded(item, custID) {
        var $attribute = $('ul#item'+item.itemID+' li#att'+item.itemAttID);
        $attribute.attr("data-theme", "b").trigger("create");
        $attribute.removeClass("ui-btn-hover-c");
        $attribute.removeClass("ui-btn-up-c");
        $attribute.addClass("ui-btn-hover-b");
        $attribute.addClass("ui-btn-up-b");
		$attribute.addClass("ui-disabled");
        $('ul#item'+item.itemID).listview("refresh");
    }  
    
	//displays the items in the shopping cart
    function displayItemsInCart(cart,custID){
      //checkout_cart=[];
      for (var i in cart){
	for (var j in cart[i]){
	        $("#shopping_cart_list").append("<li id=\""+'item' + cart[i][j].itemID +'_itemAtt'+cart[i][j].itemAttID+ "\"><a href=\"#\">" + cart[i][j].category + " - " + cart[i][j].brand + ":  "+ cart[i][j].clotheSize + " ,  " + cart[i][j].color + "    $" + cart[i][j].price +"</a><div class=\"inc button\" onClick=\"changeQuantityVal("+cart[i][j].itemID+","+cart[i][j].itemAttID+","+plus+")\" id=\"item" + cart[i][j].itemID + "itemAttID"+cart[i][j].itemAttID+"_plus\" data-inline=\"true\">+</div><input type=\"text\" id=\"item" + cart[i][j].itemID + "itemAttID"+cart[i][j].itemAttID+"_num\" value=\""+cart[i][j].quantity+"\" disabled=\"disabled\" /><div class=\"dec button\" onClick=\"changeQuantityVal("+cart[i][j].itemID+","+cart[i][j].itemAttID+","+minus+")\" id=\"item" + cart[i][j].itemID + "itemAttID"+cart[i][j].itemAttID+"_minus\" data-inline=\"true\">-</div><a onClick=\"removeItemFromCart("+cart[i][j].itemID + ", " + cart[i][j].itemAttID + ", " + custID + ")\" href=\"#\"></a></li>").listview('refresh');
	}

      }//end for
      
    }
    
	//changes the quantity of an item in the cart
    function changeQuantityVal(itemID,itemAttID,action){
      var value = $('#item'+itemID+'itemAttID'+itemAttID+'_num').val();
      switch (action) {
          case "plus":
	    value++;
	    socket.emit('changeItemQuantityInCart',itemID,itemAttID,custID,value);
	    $("#refresh_btn").removeClass('ui-disabled');
	    $('#item'+itemID+'itemAttID'+itemAttID+'_num').val(value);   
	    break;
	  case "minus":
		if(value>=0){
			value--;
			socket.emit('changeItemQuantityInCart',itemID,itemAttID,custID,value);
			$("#refresh_btn").removeClass('ui-disabled');
			$('#item'+itemID+'itemAttID'+itemAttID+'_num').val(value);
		}
	    break;
      }
    }
	//requests an item from the db when it is added to cart
    function addToCart(itemID,attID){
      socket.emit("getCartItemFromDB",itemID,attID,custID);
      
    }

	//adds the attribute list to an item dynamically after the item is pressed
    function addAttributeToItem(ID, attID, attribute,itemID) {
      var $ul = $('ul#item'+ID);
      
      $ul.append('<li id=\'att'+attID+'\'><a href="#" onClick="addToCart('+ itemID+','+ attID +')"><img src="/assets/80-shopping-cart.png" alt="Add to cart" class="ui-li-icon">' +attribute.color+' - '+attribute.clotheSize+'</a></li>').listview();
      if ($ul.hasClass('ui-listview')) {
          $ul.listview('refresh');
      } else {
          $ul.trigger('create');
      }
    }  
    
	//adds an item to the item search feed
    function addItemToSearchFeed(ID, item) {
      $('#item_searchlist').append("<div data-role=\"collapsible\" data-inset\"false\"><h3 onClick=\"loadItemAttributes("+ID+")\">" + item.category + " - " + item.brand + "</h3><ul id=\"item"+ID+"\" data-role=\"listview\" data-inset=\"false\" data-filter=\"true\" data-filter-reveal=\"true\" data-filter-placeholder=\"Search Item..\"></ul></div>").collapsibleset("refresh");
    }
    
	//loads the item attributes for an item in the search feed
    function loadItemAttributes(itemID) {
      socket.emit("getItemAttributes", itemID);
      socket.once('retrieveItemAttributes', function(ID, attributelist) {
        $("ul#item"+ID).html("");
        if(!_.isEmpty(attributelist)){
          _.uniq(attributelist);
          attributelist.sort();
          for (var att in attributelist) {
            var boughtFlag = false;
            for (var cartItem in existingCart) {
				for (var thing in existingCart[cartItem]) {
				  console.log("cart item: " + existingCart[cartItem][thing].itemAttID + " and item: "+attributelist[att].itemAttID);
				  if (existingCart[cartItem][thing].itemAttID == attributelist[att].itemAttID) {
					boughtFlag = true;
					console.log("found a match");
					break;
				  }
				}
            }
            addAttributeToItem(ID, attributelist[att].itemAttID, attributelist[att],attributelist[att].itemID);
            if(boughtFlag) changeItemAdded(attributelist[att], custID);
          }
        }
        
      });
    }  
    
	//shows a customer's past purchases
    function printPurchaseHistory(purchaseHistArr) {
      var purchaseID = -1;
      for (var i in purchaseHistArr) {
        
        var purchaseInst = purchaseHistArr[i];
        if(purchaseID!==purchaseInst.purchaseInstID){
          purchaseID = purchaseInst.purchaseInstID;
          var newDate = new Date(purchaseInst.purchaseDate);
          $("#purchase_history_list").append("<li id=\"purchase"+purchaseInst.purchaseInstID+"\" data-role=\"list-divider\">"+(newDate.getMonth()+1)+"/"+newDate.getDate()+"/"+newDate.getFullYear()+" "+newDate.getHours()+":"+newDate.getMinutes()+":"+newDate.getSeconds()+"</li>").listview('refresh');
        }  

        $("#purchase_history_list").append("<li id=\"item"+purchaseInst.itemInstID+"\"<a href=\"#\"><h3>"+purchaseInst.category+"</h3><p><strong>"+purchaseInst.brand+"</strong></p><p>"+purchaseInst.clotheSize+"  " +purchaseInst.adjPrice+"</p></a></li>").listview("refresh");
      }  
      $("#purchase_history_list").listview("refresh");
    }  
    
	//when the "helped" button is pressed on index.html for a customer
    function isHelped(ID){
        socket.emit('custHelped',ID);                       
    }

	//removes a customer from feed after he/she leaves store
    function removeCustomerFromFeed(ID) {
      var node = document.getElementById('cust'+ID);
      if(node.parentNode) {
        node.parentNode.removeChild(node);
      }    
    }

	//adds customer from feed after he/she enters store
    function addCustomerToFeed(ID, cust, time) {
	  var newDate = new Date(time);
      $('#t').prepend("<li id=\""+'cust' + ID + "\"><a onClick=\"sendIdToCustomerPage("+ID+")\" href=\"#\" data-transition=\"slide\">" + cust.firstName + " " + cust.lastName + " - " + (newDate.getMonth()+1)+"/"+newDate.getDate()+"/"+newDate.getFullYear()+" "+newDate.getHours()+":"+newDate.getMinutes()+":"+newDate.getSeconds() + "<img src = \"" + cust.picPath + "\" /></a><a onclick=\"isHelped(" + ID + ")\" href=\"#\"></a></li>").listview('refresh');
    }
    
	//adds a customer to the customer search page
    function addCustomerToSearchFeed(ID, cust) {
      $('#searchlist').append("<li class='customer' id=\""+'cust' + ID + "\"><a onClick=\"sendIdToCustomerPage("+ID+")\" href=\"#\" data-transition=\"slide\">" + cust.firstName + " " + cust.lastName +"</a></li>").listview('refresh');
    }  
    
	//when a page change is made and a customer is currently being viewed,
	//set the global customer ID for that specific client so the next page
	//can receive it.
    function sendIdToCustomerPage(ID) {
		console.log("this is our ID: " +ID);
      socket.emit("setCustomerID", ID);
      $.mobile.changePage( "/customer.html", {
        role: "page",
        type: "get",
        data:{ID:ID},
        transition: "slide"
      });
    }

	//when an id is read in (manually) (old)
    function idRead() {
        var idIn = document.getElementById('inputbx').value;
        socket.emit("cusEnterLeave", idIn);
        document.getElementById('inputbx').value = "";
    }

	//adds the data for a customer
    function addCustomerData(ID, cust, time) {
	$("h1#customer").text(cust.firstName + " " + cust.lastName);
        $(".time").text("Entered the store " + time);
    }
    
	//helper for the item search page
    function exitPage(theSocket,listeners) {
      theSocket.removeListener('retrieveItemAttributes');
    }  
    
	//function for when a page is loaded to change the current page
    function loadPage(page) {
      exitPage(socket);
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
	case 'checkout':
	  socket.emit("setCustomerID", custID);
	  $.mobile.changePage( "/checkout.html", {
	      role: "page",
	      type: "get",
	      data:{ID:custID},
	      transition: "slide"
	    });
	break;
     }
      
    }
    
	//sends the customer id to the customer page
function sendIdToCustomerPage(ID) {
	socket.emit("setCustomerID", ID);
	$.mobile.changePage( "/customer.html", {
	role: "page",
	type: "get",
	data:{ID:ID},
	transition: "slide"
	});
}

//adjust the color scheme of a customer after they've been helped
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
