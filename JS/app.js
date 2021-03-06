/////////////////////////
// Global Variables
/////////////////////////

//Form Elements
const form_product = document.querySelector('#productName');
const form_cost = document.querySelector('#costPrice');
const form_selling = document.querySelector('#sellingPrice');
const form_vatRate = document.querySelector('#vatRate');
const submitButtonProduct = document.querySelector('#submit');
const form_gp_calculator = document.querySelector('#gpCalculator');
const output_productContainer = document.querySelector('#productContainer');

const sortByAZ = document.querySelector('#sortByAzRadio');
const sortByCashProfit = document.querySelector('#sortByCashProfitRadio');
const sortByGPpercentage = document.querySelector('#sortByGPRadio');

let sortOrder; // Product Sort Order
let productStore = new ProductStore([]);

/////////////////////////
// Functions
/////////////////////////

const localStorageExits = function () {

    if (localStorage.getItem('products') === null) {
        return false;
    } else {
        return true;
    }
}

function clearForm() {
    form_product.value = '';
    form_cost.value = '';
    form_selling.value = '';
    form_vatRate.value = '20';
}

function formValidates() {
    // This function validates the inputs of the add product form and returns a bool.

    const nameRegex = /^[a-zA-z0-9'!@, ]+$/;
    const priceRegex = /^£?[\d]+\.?(\d\d)?/;

    // Functions to test the individual form elements
    function validateProductName() {
        if (nameRegex.test(form_product.value)) {
            return true;
        }
    }

    function validateCostPrice() {
        if (priceRegex.test(form_cost.value)) {
            return true
        }
    }

    function validateSellingPrice() {
        if (priceRegex.test(form_selling.value) && (form_selling.value > form_cost.value)) {
            return true
        }
    }

    // Testing if all inputs on the form validate and returnin the overall true/false value
    if (validateProductName() && validateCostPrice() && validateSellingPrice()) {
        return true;
    } else {
        return false;
    }
}

function enableProductForm() {
    if (formValidates()) {
        submitButtonProduct.removeAttribute("disabled");
    }
    if (!formValidates()) {
        submitButtonProduct.setAttribute("disabled", "");
    }
}

function checkSortRadio() {
    sortOrder = localStorage.getItem('sortOrder');

    if (sortOrder === 'AZ') {
        sortByAZ.setAttribute('checked', "");
        return
    }
    if (sortOrder === 'Cash') {
        sortByCashProfit.setAttribute('checked', "");
        return
    }
    if (sortOrder === 'Percentage') {
        sortByGPpercentage.setAttribute('checked', "");
        return
    } else {
        sortOrder = 'AZ';
        sortByAZ.setAttribute('checked', "");
    }
}

function addProduct() {

    //Assign form values to Variables
    const productName = form_product.value;
    const costPrice = parseFloat(form_cost.value);
    const sellingPrice = parseFloat(form_selling.value);
    const vatPercent = parseFloat(form_vatRate.value);

    const newProduct = new Product(productName, costPrice, sellingPrice, vatPercent, productStore);
    productStore.products.push(newProduct);
    clearForm();
    saveToStorage(productStore);
    submitButtonProduct.setAttribute("disabled", "");

    if (productStore.products) {
        productStore.refreshSortOrder(sortOrder);
        output_productContainer.innerHTML = "";
        refreshProductDiv();
    }

}

function generateProductDiv(product) {

    let productDiv = document.createElement('DIV');
    productDiv.classList.add('product');
    productDiv.setAttribute("data-product-id", product.id);

    let name = product.name;
    let costPrice = product.costPrice.toFixed(2);
    let sellingPrice = product.sellingPrice.toFixed(2);
    let cashProfit = product.cashProfit.toFixed(2);
    let gpPercent = product.gpPercent.toFixed(2);

    let innerHTML =
        `<div class="card ml-0 mr-3 mb-2 p-0 pb-2">
            <div class="card-body p-0">
                <h4 class="card-title m-4">${name}</h4>
                <h6 class="card-subtitle ml-4 text-muted">GP: ${gpPercent}%</h6>
                <p class="card-text">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between"><span class="text-muted">Cash Profit:</span> £${cashProfit}</li>
                        <li class="list-group-item d-flex justify-content-between"><span class="text-muted">Cost Price:</span> £${costPrice}</li>
                        <li class="list-group-item d-flex justify-content-between"><span class="text-muted mr-5">Selling Price:</span> £${sellingPrice}</li>
                    </ul>
                </p>
                <a href="#" class='edit card-link mx-4 my-2' data-toggle="modal" data-target="#editProductModal">Edit</a>
                <a href="#" class='remove card-link mx-4 my-2'>Remove</a>
            </div>
        </div>`

    productDiv.innerHTML = innerHTML;
    output_productContainer.appendChild(productDiv);
}

function refreshProductDiv() {
    output_productContainer.innerHTML = "";
    displayProducts();
}

function removeProduct(e) {

    if (e.target.classList.contains('remove')) {
        const button = e.target;
        const productToRemove = button.parentNode.parentNode.parentNode;
        const productToRemoveID = parseInt(productToRemove.getAttribute('data-product-id'));
        console.log(productToRemove);
        console.log(productToRemoveID);

        productStore.products = productStore.products.filter(product => product.id !== productToRemoveID);
        saveToStorage(productStore)
        productToRemove.remove();
    }
}

function saveToStorage(productStore) {
    localStorage.setItem('products', JSON.stringify(productStore.products));
}

function refreshFromStorage(productStore) {
    productStore.products = JSON.parse(localStorage.getItem('products'));
}


function startUp() {
    // refreshes sort order from local storage

    if (localStorageExits()) {
        refreshFromStorage(productStore);
        checkSortRadio();
        productStore.refreshSortOrder(sortOrder);
        if (productStore.products) {
            displayProducts();
        }
    }
}

function displayProducts() {
    productStore.products.forEach((product) => {
        generateProductDiv(product);
    });
}

// Save sort order to local storage so that it can be refreshed on page reload
function setSortOrder(sortOrder) {
    localStorage.setItem('sortOrder', sortOrder);
    return sortOrder;
}


/////////////////////////
// Event Listeners
/////////////////////////

// Add a product event listener
submitButtonProduct.addEventListener('click', (e) => {
    e.preventDefault();
    addProduct();
});

// Enable form if inputs are valid
form_gp_calculator.addEventListener('input', () => enableProductForm());

// Removes a product from the product container
output_productContainer.addEventListener('click', (e) => {
    removeProduct(e)
});

// Sorts product card based on which radio button is selected
sortByCashProfit.addEventListener('click', () => {
    productStore.sortProductsByCashProfit();
    sortOrder = setSortOrder('Cash');
    refreshProductDiv();
})

sortByAZ.addEventListener('click', () => {
    sortOrder = setSortOrder('AZ');
    productStore.sortProductsByName();
    refreshProductDiv();
})

sortByGPpercentage.addEventListener('click', () => {
    productStore.sortProductsByGP();
    sortOrder = setSortOrder('Percentage');
    refreshProductDiv();
})

//Runs startup routine to re-cache local storage once page loads
window.addEventListener('DOMContentLoaded', startUp);