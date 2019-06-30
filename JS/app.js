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
    
    constructor(name, costPrice, sellingPrice, vatPercent){
        this.id = products.length+1;
        this.name = name;
        this.costPrice = costPrice;
        this.sellingPrice = sellingPrice;
        this.vatPercent = vatPercent;
        this.cashProfit = this.calcCashProfit();
        this.gpPercent = this.calcGpPercent();     
    }

    calcCashProfit(){
        return (this.sellingPrice / this.returnVatX()) - this.costPrice;
    }

    calcGpPercent(){
        const vatX = this.returnVatX(this.vatPercent);
        const sellingPrice = this.sellingPrice;
        const costPrice = this.costPrice;
        const gpPercent = (((sellingPrice/ vatX) - costPrice) / ( sellingPrice/ vatX) * 100);
        return gpPercent
    }

    returnVatX(){
        return (this.vatPercent/100)+1;
    }

}

/////////////////////////
// Functions
/////////////////////////

function clearForm(){
    form_product.value = '';
    form_cost.value = '';
    form_selling.value = '';
    form_vatRate.value = '20';
}

function formValidates(){

    return true;
}

function addProduct(){
    
    const productName = form_product.value;
    const costPrice = parseFloat(form_cost.value);
    const sellingPrice = parseFloat(form_selling.value);
    const vatPercent = parseFloat(form_vatRate.value); 

    if (formValidates){

        const newProduct = new Product(productName, costPrice, sellingPrice, vatPercent);
        products.push(newProduct);

        generateProductDiv(newProduct);
        clearForm();    
    }
}

function generateProductDiv(newProduct){

    let productDiv = document.createElement('DIV');
    productDiv.classList.add('product');
    productDiv.setAttribute("data-product-id", newProduct.id);
    
    let name = newProduct.name;
    let costPrice = newProduct.costPrice.toFixed(2);
    let sellingPrice = newProduct.sellingPrice.toFixed(2);
    let cashProfit = newProduct.cashProfit.toFixed(2);
    let gpPercent = newProduct.gpPercent.toFixed(2);

    let innerHTML =
        `<div class="card ml-2 mr-1 mb-2 p-0 pb-2">
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

function removeParentElement(e){

    if(e.target.classList.contains('remove')){
        const button = e.target;
        const product = button.parentNode.parentNode.parentNode;
        product.remove();
    }
}


/////////////////////////
// Event Listeners
/////////////////////////

form_calculate.addEventListener('click', addProduct);
output_productContainer.addEventListener('click', removeParentElement);