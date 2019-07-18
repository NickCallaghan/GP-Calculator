/////////////////////////
// Class Definitions
/////////////////////////

class Product {

    constructor(name, costPrice, sellingPrice, vatPercent) {
        this.id = products.length + 1 || 1;
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

class ProductStore {

    constructor(productsArray) {
        this.products = productsArray;
    }

    refreshSortOrder(sortOrder){
        if (sortOrder === 'AZ'){
            this.sortProductsByName()
        } else if (sortOrder === 'Cash'){
            this.sortProductsByCashProfit()
        } else if (sortOrder === 'Percentage'){
            this.sortProductsByGP()
        }
    }

    sortProductsByName() {
        this.products = this.products.sort(function (a, b) {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
        });        
    }

    sortProductsByCashProfit(){
        this.products = this.products.sort((a, b) => {
            if (a.cashProfit > b.cashProfit) {
              return -1;
            }
            if (a.cashProfit < b.cashProfit) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });
    }

    sortProductsByGP(){
        this.products = this.products.sort((a, b) => {
            if (a.gpPercent > b.gpPercent) {
              return -1;
            }
            if (a.gpPercent < b.gpPercent) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });
    }

}


