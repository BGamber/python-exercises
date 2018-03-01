// var orderList = [];
var apiAddress = 'http://dc-coffeerun.herokuapp.com/api/coffeeorders';
var orderForm = document.querySelector('form');

var orderTracker = function() {
    var orderList = [];
    return {
        saveLocalOrderList: function() {
            localStorage.setItem('orders', JSON.stringify(orderList));
        },
        loadLocalOrderList: function() {
            if (localStorage.getItem('orders') !== null) {
                orderList = JSON.parse(localStorage.getItem('orders'));
            }
        },
        loadOrderList: function() {
            console.log('Querying server...');
            var onlineList = [];
            $.ajax({
                async: false,
                type: 'GET',
                url: apiAddress,
                success: function(data) {
                    for (var key in data) {
                        onlineList.push(data[key]);
                    };
                }
           });
            console.log('Query done.')
            orderList = onlineList;
        },
        addOrder: function(order) {
            // orderList.push(order);
            // this.saveLocalOrderList();
            $.post(apiAddress, order, function() {
                this.updateOrderList();
            });
        },
        removeOrder: function(index) {
            orderList.splice(index, 1);
        },
        makeOrderString: function(order) {
            orderString = '';
            orderString += `Order: ${order['coffee']} - `;
            orderString += `Email: ${order['emailAddress']} - `;
            orderString += `Size: ${order['size']} - `;
            orderString += `Flavor: ${order['flavor']} - `;
            orderString += `Strength: ${order['strength']} `;
            return orderString;
        },
        updateOrderList: function() {
            // this.loadLocalOrderList();
            this.loadOrderList();
            var $pageList = $('#order-list');
            $pageList.empty();
            orderList.forEach(function(order, i) {
                let newListItem = document.createElement('li');
                let orderID = order['_id'].split('').splice(order['_id'].length - 2).join('');
                newListItem.setAttribute('data-id', orderID);
                newListItem.setAttribute('data-email', order['emailAddress']);
                let listText = (i+1)+'. '+orderTracker.makeOrderString(order);
                newListItem.textContent = listText;
                newListItem.classList.add('order-item')
                let $button = $('<a>').attr('href', '#').append($('<span>'));
                $button.addClass('complete-button');
                $button.text('Complete Order');
                $button.click(function(event) {
                    event.preventDefault();
                    var email = '/' + $(this)[0].parentElement.getAttribute('data-email');
                    // var email = $(this).emailAddress;
                    $.ajax({
                        type: 'DELETE',
                        url: apiAddress+email,
                        complete: function() {
                            orderTracker.updateOrderList();
                        }
                    })
                });
                // $button.click(function(event) {
                //     event.preventDefault();
                //     let indx = $(this).parent()[0].getAttribute('data-id');
                //     orderTracker.removeOrder(indx);
                //     orderTracker.updateOrderList();
                // });
                newListItem.appendChild($button[0]);
                $pageList.append(newListItem);
            });
            // this.saveLocalOrderList();
        }
    };
}();

// var updateOrderList = function() {
//     var $pageList = $('#order-list');
//     $pageList.empty();
//     orderList.forEach(function(order, i) {
//         let newListItem = document.createElement('li');
//         let listText = "";
//         newListItem.setAttribute('data-id', i);
//         for (key in order) {
//             listText += (`${key}: ${order[key]} - `);
//         };
//         newListItem.textContent = listText;
//         newListItem.classList.add('order-item')
//         let $button = $('<a>').attr('href', '#').append($('<span>'));
//         $button.addClass('complete-button');
//         $button.text('Complete Order');
//         $button.click(function(event) {
//             event.preventDefault();
//             let indx = $(this).parent()[0].getAttribute('data-id');
//             orderList.splice(indx, 1);
//             updateOrderList();
//         });
//         newListItem.appendChild($button[0]);
//         $pageList.append(newListItem);
//     });
//     localStorage.setItem('orders', JSON.stringify(orderList));
// };

orderForm.addEventListener('submit', function(event) {
    event.preventDefault();
    var order = {};
    for (let i=0; i < orderForm.length; i++) {
        let element = orderForm.elements[i];
        if (element.type === 'radio' && element.checked === true) {
            order[element.name] = element.value;
        } else if (element.type !== 'radio' && element.nodeName !== 'BUTTON') {
            order[element.name] = element.value;
        };
    };
    orderTracker.addOrder(order);
});

// IDEA: Create object (via factory) for storing data and functions
// - Add, remove, load, and save orders to storage; update page
// - tracks order list without app direct access

// Once everything else is set, load data if it exists!
// if (localStorage.getItem('orders') !== null) {
//     orderList = JSON.parse(localStorage.getItem('orders'));
//     updateOrderList();
// }
orderTracker.updateOrderList();