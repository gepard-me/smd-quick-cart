var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
// 👇 Change this to your actual store URL
var SHOPIFY_STORE_URL = 'https://shop.smartdoll.jp';
var PRODUCTS_JSON_URL = "".concat(SHOPIFY_STORE_URL, "/products.json");
var excludedTags = ["coming-soon"];
// 🛒 This will track selected variant quantities
var cart = {};
var products = [];
function updateQuantity(variantId, delta) {
    var currentQty = cart[variantId] || 0;
    var newQty = Math.max(0, currentQty + delta);
    cart[variantId] = newQty;
    var qtyElement = document.getElementById("qty-".concat(variantId));
    if (qtyElement)
        qtyElement.textContent = newQty.toString();
}
function generateCartLink() {
    var items = Object.entries(cart)
        .filter(function (_a) {
        var _ = _a[0], qty = _a[1];
        return qty > 0;
    })
        .map(function (_a) {
        var id = _a[0], qty = _a[1];
        return "".concat(id, ":").concat(qty);
    })
        .join(',');
    var cartUrl = "".concat(SHOPIFY_STORE_URL, "/cart/").concat(items, "?storefront=true");
    // Update the cart link display
    document.getElementById("cart-link").textContent = cartUrl;
}
;
var renderProducts = function (products) {
    var _a, _b, _c;
    // Get selected sort option
    var sortOption = document.getElementById('sort').value;
    // Get the search input element
    var searchInput = document.getElementById("product-search");
    var searchTerm = (_a = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    // Get selected filter option
    var filterOption = document.getElementById('filter').value;
    var newAwakeChecked = (_b = document.getElementById('newawake-filter')) === null || _b === void 0 ? void 0 : _b.checked;
    var showEverything = (_c = document.getElementById('show-all-filter')) === null || _c === void 0 ? void 0 : _c.checked;
    // Apply filtering (e.g., show only in stock products)
    var filteredProducts = products.filter(function (product) {
        var ret = true;
        if (searchTerm && !product.title.toLowerCase().includes(searchTerm))
            return false;
        if (newAwakeChecked && !product.tags.includes("newawake"))
            return false;
        if (filterOption === 'in_stock') {
            ret = product.variants.some(function (variant) { return variant.available; }); // At least one variant available
        }
        else if (filterOption === 'out_of_stock') {
            ret = product.variants.every(function (variant) { return !variant.available; }); // All variants out of stock
        }
        if (showEverything)
            return ret;
        // Exclude products that contain any of the excluded tags
        var hasExcludedTag = product.tags.some(function (tag) { return excludedTags.includes(tag); });
        if (hasExcludedTag)
            return false;
        if (product.variants.every(function (variant) { return Number(variant.price) > 300000; }))
            return false;
        if (product.product_type === "Notion Article")
            return false;
        return ret; // For 'all' option
    });
    // Apply sorting (default to descending by product ID)
    var sortedProducts = filteredProducts.sort(function (a, b) {
        if (sortOption === 'price') {
            var priceA = a.variants[0].price; // Assumes the first variant is the one to compare
            var priceB = b.variants[0].price;
            return priceA - priceB;
        }
        else if (sortOption === 'id') {
            return b.id - a.id; // Sort by product ID descending (b.id - a.id)
        }
        else { // Default sort by title
            return a.title.localeCompare(b.title);
        }
    });
    // Update the product count
    var totalCount = sortedProducts.length;
    document.getElementById('total-count').textContent = totalCount.toString();
    var productListEl = document.getElementById('product-list');
    if (!productListEl)
        return;
    // Clear existing products before re-rendering
    productListEl.innerHTML = '';
    // Render sorted and filtered products
    sortedProducts.forEach(function (product) {
        var productEl = document.createElement('div');
        productEl.className = 'product';
        var productInner = document.createElement('div');
        productInner.className = 'product-inner';
        var img = document.createElement('img');
        img.src = product.images.length > 0
            ? product.images[0].src
            : 'https://dummyimage.com/100x100/cccccc/000000&text=No+Image';
        img.alt = product.title;
        img.className = 'product-thumb';
        var productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        var titleEl = document.createElement('h2');
        var link = document.createElement('a');
        link.href = "".concat(SHOPIFY_STORE_URL, "/products/").concat(product.handle);
        link.textContent = product.title;
        link.target = "_blank";
        titleEl.appendChild(link);
        productInfo.appendChild(titleEl);
        productInner.appendChild(img);
        productInner.appendChild(productInfo);
        productEl.appendChild(productInner);
        // Append variants
        product.variants.forEach(function (variant) {
            var variantEl = document.createElement('div');
            var dis = variant.available ? '' : 'disabled';
            var title = variant.title === "Default Title" ? "" : variant.title;
            variantEl.className = 'variant';
            var price = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(Number(variant.price));
            variantEl.innerHTML = "\n            <strong>".concat(title, "</strong><span class=\"price\">").concat(price, "</span>\n            <div class=\"variant-controls\">\n              <button id=\"remove-").concat(variant.id, "\" ").concat(dis, ">\u2212</button>\n              <span id=\"qty-").concat(variant.id, "\">0</span>\n              <button id=\"add-").concat(variant.id, "\" ").concat(dis, ">+</button>\n            </div>\n          ");
            productInfo.appendChild(variantEl);
        });
        productListEl.appendChild(productEl);
    });
    // Set up event listeners
    document.querySelectorAll('button[id^="add-"]').forEach(function (btn) {
        var variantId = parseInt(btn.id.replace('add-', ''));
        btn.addEventListener('click', function () { updateQuantity(variantId, 1); generateCartLink(); });
    });
    document.querySelectorAll('button[id^="remove-"]').forEach(function (btn) {
        var variantId = parseInt(btn.id.replace('remove-', ''));
        btn.addEventListener('click', function () { updateQuantity(variantId, -1); generateCartLink(); });
    });
};
var getAllProducts = function () { return __awaiter(_this, void 0, void 0, function () {
    var products, url, page, morePages, response, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                products = [];
                url = "".concat(SHOPIFY_STORE_URL, "/products.json?limit=250");
                page = 1;
                morePages = true;
                _a.label = 1;
            case 1:
                if (!morePages) return [3 /*break*/, 9];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 7, , 8]);
                return [4 /*yield*/, fetch("".concat(url, "&page=").concat(page))];
            case 3:
                response = _a.sent();
                if (!(response.status == 404)) return [3 /*break*/, 4];
                morePages = false;
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, response.json()];
            case 5:
                data = _a.sent();
                if (data.products.length === 0) {
                    morePages = false;
                }
                else { }
                // Add the current page's products to the list
                products = __spreadArray(__spreadArray([], products, true), data.products, true);
                page++;
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                console.error("Error fetching products:", error_1);
                morePages = false;
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 1];
            case 9: return [2 /*return*/, products];
        }
    });
}); };
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var copyButton, err_1, container;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getAllProducts()];
                case 1:
                    products = _f.sent(); // Fetch all products
                    renderProducts(products); // Render the list
                    // Set up event listeners for sorting and filtering
                    (_a = document.getElementById('sort')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', function () { return renderProducts(products); });
                    (_b = document.getElementById('filter')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', function () { return renderProducts(products); });
                    (_c = document.getElementById('newawake-filter')) === null || _c === void 0 ? void 0 : _c.addEventListener('change', function () { return renderProducts(products); });
                    (_d = document.getElementById('show-all-filter')) === null || _d === void 0 ? void 0 : _d.addEventListener('change', function () { return renderProducts(products); });
                    (_e = document.getElementById("product-search")) === null || _e === void 0 ? void 0 : _e.addEventListener("input", function () { return renderProducts(products); });
                    generateCartLink();
                    copyButton = document.getElementById("copy-cart-link");
                    copyButton.addEventListener("click", function () {
                        var cartUrl = document.getElementById("cart-link").textContent;
                        navigator.clipboard.writeText(cartUrl).then(function () {
                            alert("Cart link copied to clipboard!");
                        }).catch(function (err) {
                            console.error("Failed to copy text: ", err);
                        });
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _f.sent();
                    console.error('Error:', err_1);
                    container = document.getElementById('product-list');
                    if (container) {
                        container.innerHTML = "<p style=\"color:red;\">Error occured. Please report it: </p>".concat(err_1);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
init();
