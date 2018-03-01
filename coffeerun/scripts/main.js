// var orderList = [];

var orderForm = document.querySelector('form');

var orderTracker = function() {
    var orderList = [];
    return {
        saveOrderList: function() {
            localStorage.setItem('orders', JSON.stringify(orderList));
        },
        loadOrderList: function() {
            if (localStorage.getItem('orders') !== null) {
                orderList = JSON.parse(localStorage.getItem('orders'));
            }
        },
        addOrder: function(order) {
            orderList.push(order);
            this.saveOrderList();
        },
        removeOrder: function(index) {
            orderList.splice(index, 1);
        },
        updateOrderList: function() {
            this.loadOrderList();
            var $pageList = $('#order-list');
            $pageList.empty();
            orderList.forEach(function(order, i) {
                let newListItem = document.createElement('li');
                let listText = "";
                newListItem.setAttribute('data-id', i);
                for (key in order) {
                    listText += (`${key}: ${order[key]} - `);
                };
                newListItem.textContent = listText;
                newListItem.classList.add('order-item')
                let $button = $('<a>').attr('href', '#').append($('<span>'));
                $button.addClass('complete-button');
                $button.text('Complete Order');
                $button.click(function(event) {
                    event.preventDefault();
                    let indx = $(this).parent()[0].getAttribute('data-id');
                    orderList.splice(indx, 1);
                    updateOrderList();
                });
                newListItem.appendChild($button[0]);
                $pageList.append(newListItem);
            });
            this.saveOrderList();
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
    orderTracker.updateOrderList();
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