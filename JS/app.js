/////////////////////////
// Global Variables
/////////////////////////
const form_product = document.querySelector('#productName');
const form_cost = document.querySelector('#costPrice');
const form_selling = document.querySelector('#sellingPrice');
const form_vatRate = document.querySelector('#vatRate');
const form_calculate = document.querySelector('#calculate');
const form_gp_calculator = document.querySelector('#gpCalculator');
const output_productContainer = document.querySelector('#productContainer');

let products = []; // Array of objects containing all products

/////////////////////////
// Class Definitions
/////////////////////////

class Product{
    constructor(name, costPrice, vatFactor, sellingPrice, cashProfit, gpPercentage){
        this.name = name;
        this.costPrice = costPrice;
        this.vatFactor = vatFactor;
        this.sellingPrice = sellingPrice;
        this.cashProfit = cashProfit;
        this.gpPercentage = gpPercentage;
    }
}

/////////////////////////
// Functions
/////////////////////////

function clearForm(){
    form_product.value = '';
    form_cost.value = '';
    form_selling.value = '';
    form_vatRate.value = '';
}

//Creates a product card for a new product and inserts to the pages
function createProductCards(product){

    let productDiv = document.createElement('DIV');
    productDiv.classList.add('product');
    let name = product['name'];
    let costPrice = product['costPrice'];
    let sellingPrice = product['sellingPrice'];
    let cashProfit = product['cashProfit']
    let gpPercentage = product['gpPercentage'];

    let innerHTML =
        `<div class="card">
            <div class="card-body">
                <h4 class="card-title">${name}</h4>
                <h6 class="card-subtitle mb-2 text-muted">GP: ${gpPercentage}%</h6>
                <p class="card-text">
                    <ul>
                        <li>Cash Profit: £${cashProfit}</li>
                        <li>Cost Price: £${costPrice}</li>
                        <li><p>Selling Price: £${sellingPrice}</li>
                    </ul>
                </p>
                <button class='remove'>Remove</button>
            </div>
        </div>`

    productDiv.innerHTML = innerHTML;
    output_productContainer.appendChild(productDiv);
    }

function calculateGP(){

    function setVatRate(){
        if (form_vatRate.value === 'zero'){
            return 1;
        }else if (form_vatRate.value === '20percent') {
            return 1.2;
        };
    };

    let name = form_product.value;
    let cost = parseFloat(form_cost.value).toFixed(2);
    let vatFactor = setVatRate();
    let selling = parseFloat(form_selling.value).toFixed(2);
    let cashProfit = ((selling/vatFactor) - cost).toFixed(2);
    let gpPercentage = (cashProfit / (selling/vatFactor)) * 100;
    gpPercentage = gpPercentage.toFixed(2);

    let newProduct = new Product(name, cost, vatFactor, selling, cashProfit, gpPercentage);
    products.push(newProduct);
    clearForm();

    createProductCards(newProduct);
}

function removeParentElement(e){
    if(e.target.tagName === 'BUTTON'){
        const button = e.target;
        const product = button.parentNode;
        product.remove();
    }


}

/////////////////////////
// Event Listeners
/////////////////////////

form_calculate.addEventListener('click', calculateGP);
output_productContainer.addEventListener('click', removeParentElement);
