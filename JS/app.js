/////////////////////////
// Global Variables
/////////////////////////
const form_product = document.querySelector('#productName');
const form_cost = document.querySelector('#costPrice');
const form_selling = document.querySelector('#sellingPrice');
const form_vatRate = document.querySelector('#vatRate');
const submitButtonProduct = document.querySelector('#submit');
const form_gp_calculator = document.querySelector('#gpCalculator');
const output_productContainer = document.querySelector('#productContainer');

let products = []; // Array of objects containing all products

/////////////////////////
// Class Definitions
/////////////////////////

class Product {

    constructor(name, costPrice, sellingPrice, vatPercent) {
        this.id = products.length + 1;
        this.name = name;
        this.costPrice = costPrice;
        this.sellingPrice = sellingPrice;
        this.vatPercent = vatPercent;
        this.cashProfit = this.calcCashProfit();
        this.gpPercent = this.calcGpPercent();
    }

    calcCashProfit() {
        return (this.sellingPrice / this.returnVatX()) - this.costPrice;
    }

    calcGpPercent() {
        const vatX = this.returnVatX(this.vatPercent);
        const sellingPrice = this.sellingPrice;
        const costPrice = this.costPrice;
        const gpPercent = (((sellingPrice / vatX) - costPrice) / (sellingPrice / vatX) * 100);
        return gpPercent
    }

    returnVatX() {
        return (this.vatPercent / 100) + 1;
    }

}

/////////////////////////
// Functions
/////////////////////////

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

function addProduct() {

    //Assign form values to Variables
    const productName = form_product.value;
    const costPrice = parseFloat(form_cost.value);
    const sellingPrice = parseFloat(form_selling.value);
    const vatPercent = parseFloat(form_vatRate.value);

    const newProduct = new Product(productName, costPrice, sellingPrice, vatPercent);
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    clearForm();
    submitButtonProduct.setAttribute("disabled", "");
    console.log(products);
    console.log('products: ', products.length);

    if (products.length > 0) {
        products = sortProductsByName(products);
    }

    // generateProductDiv(newProduct);
    // clearProductDiv();
    // // displayProducts();

    // console.log(products);
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

function clearProductDiv() {
    const productsDiv = document.getElementById("productContainer");
    productsDiv.innerHTML = '';
}

function removeProduct(e) {

    if (e.target.classList.contains('remove')) {
        const button = e.target;
        const productToRemove = button.parentNode.parentNode.parentNode;
        const productToRemoveID = productToRemove.getAttribute('data-product-id');

        products = products.filter(product => product.id != productToRemoveID);
        productToRemove.remove();
        saveToStorage(products);
    }
}

function saveToStorage(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function sortProductsByName(unsortedProducts) {
    products = unsortedProducts.sort(function (a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
    });
    console.log(products);
}


function displayProducts() {
    products = JSON.parse(localStorage.getItem('products'));
    if (products.length > 0) {
        products.forEach(function (product) {
            generateProductDiv(product);
        });
    }
}


/////////////////////////
// Event Listeners
/////////////////////////

// Add a product event listener
submitButtonProduct.addEventListener('click', (e) => {
    e.preventDefault();
    addProduct();
});

form_gp_calculator.addEventListener('input', () => {
    enableProductForm();
});

output_productContainer.addEventListener('click', removeProduct);

window.addEventListener('DOMContentLoaded', displayProducts);