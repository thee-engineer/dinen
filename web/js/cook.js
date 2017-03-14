var apiURL = 'api/v1/api.php';

var Status = {ERROR: 0, SUCCESS: 1};
var menuLoaded = false;
var menuItems = {};

$(function(){
  getMenu();
});

window.setInterval(getOrders, 10000);

// Get unifinished orders for restaurant
// Needs to have 'restaurant' (restaurant id)
// as parameters
function getOrders()
{
  // if menu GET parameter doesn't exist, abort operation
  if(!('restaurant' in get_url_vars())) {
    console.log("No restaurant parameter in GET");
    return;
  }
  var requestData = {'request': 'get_unfinished_order_items',
                     'restaurant_id' : get_url_vars()['restaurant']};
  $.ajax({
    url: apiURL,
    type: 'POST',
    data: requestData
  }).done(processOrderItems);
}

// Get menu for restaurant
// Needs to have 'restaurant' (restaurant id)
// as parameters
function getMenu()
{
  // if menu GET parameter doesn't exist, abort operation
  if(!('restaurant' in get_url_vars())) {
    console.log("No restaurant parameter in GET");
    return;
  }
  var requestData = {'request': 'get_menu',
                     'restaurant_id' : get_url_vars()['restaurant']};
  $.ajax({
    url: apiURL,
    type: 'POST',
    data: requestData
  }).done(processMenuItems);

  return false;
}

function processOrderItems(response)
{
  // TODO: Check for errors
  // don't process items if menu isn't loaded
  if(!menuLoaded)
    return;
  $('#order-items').empty();
  var data = response['data'];
  data.forEach(function(orderItem){
    var string = "<tr>" +
                 "<th>" + orderItem.order_id + "</th>" +
                 "<th>" + menuItems[orderItem.menu_item_id].name + "</th>" +
                 "<th>" + "TODO" + "</th>" +
                 "</tr>";
    $('#order-items').append(string);
  });
}

function processMenuItems(response)
{
  menuLoaded = true;
  var data = response['data'];
  data.forEach(function(menuItem){
    menuItems[menuItem.id] = menuItem;
  });
  console.log(menuItems);
  getOrders();
}

function get_url_vars()
{
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}
