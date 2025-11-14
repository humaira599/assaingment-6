const API_BASE = 'https://openapi.programming-hero.com/api/';
const API = {
    allPlants: API_BASE + 'plants',
    category: (id) => API_BASE + 'category/' + id,
    plantsDetails: (id) => API_BASE + 'plants/' + id,
};


const categoryList = document.getElementById ('category-list');

const plantContainer = document.getElementById ('plant-container');

const cartItemsContainer = document.getElementById ('cart-items');

const cartTotalElement = document.getElementById ('cart-total');

const modalElement = document.getElementById ('plant-details-modal');

const modalContenBox = document.getElementById ('modal-content-box');

const modalBody = document.getElementById ('modal-details-body');

let cart = [];

const CUSTOM_CATEGORISE = [
    {name: 'All Trees', apiId: 'all'},
    {name: 'Fruit Trees', apiId: '1'},
    {name: 'Flowering', apiId: '2'},
    {name: 'Shade Trees', apiId: '3'},
    {name: 'Medicinal Trees', apiId: '4'},
    {name: 'Timber Trees', apiId: '5'},
    {name: 'Evergreen Trees', apiId: '6'},
    {name: 'Ornamental Plants', apiId: '7'},
    {name: 'Bamboo', apiId: '8'},
    {name: 'Climbers', apiId: '9'},
    {name: 'Aquatic Plants', apiId: '10'},
];

// 1. core fetch and display logic

const fetchData = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();
       if (url.includes(API_BASE+'plants/') && !url.includes('category/')){
        return data;
       }
       return data.data || data.plants || [];
    } catch (error) {
        console.error ("API Fetch Error:", error);
        return null;
    }
};

// load category
const loadCategories = () => {
    categoryList.innerHTML = '';

    CUSTOM_CATEGORISE.forEach(category => {
    const button = creatCategoryButton (category.name, category.apiId);
    categoryList.appendChild(button);
    } );

    // all tress load
    document.querySelector('#category-list button').click();
};

// category button
const creatCategoryButton = (name, apiId) => {
    const button = document.createElement ('button');
    button.innerText = name;
    button.classList.add('w-full', 'text-left',
        'p-2', 'rounded', 'hover:bg-green-200',
        'text-gray-800', 'mb-1', 'font-semibold',
        'transition-colors', 'duration-200' );

        button.onclick = () => {
            document.querySelectorAll('#category-list button').forEach(btn => {
                btn.classList.remove('bg-green-700',
                    'text-white');
                btn.classList.add ('hover:bg-green-200',
                    'text-gray-800' );
            });
            button.classList.add('bg-green-800',
                'text-white');
            button.classList.remove ('hover:bg-green-200', 'text-gray-800');

            loadPlants(apiId);
        };
        return button;                  
};
// plants load
const loadPlants = async (apiId) => {
    plantContainer.innerHTML = '<p class="text-center col-span-full text-lg py-10">Loading...</p>';

    let url = apiId === 'all' ? API.allPlants : API.category(apiId);
    const plants = await fetchData(url);
    plantContainer.innerHTML = '';
   
    if (!plants || plants.length === 0) {
    plantContainer.innerHTML = '<p class="text-center col-span-full text-lg text-gray-500">No plants found for this category (ID:' + apiId +').</p>';
    return;
    }

    plants.forEach(plant => {
    plantContainer.innerHTML += creatPlantCard (plant);
    });
};

// html cart
const creatPlantCard = (plant) => {
    const price = plant.price || 'N/A';
    return `
    <div onclick="openModal('${plant.id}')"
    class="bg-white p-4 border border-gray-200
    rounded-lg shadow-md hover:shadow-xl cursor-pointer transition duration-300">
    <div class="h-40 bg-gray-100 rounded-md mb-3 overflow-hidden">
    <img src="${plant.image || 'https://via.placeholder.com/150'}" alt="${plant.name}" class="w-full h-full object-cover">  </div>
  
    <h3 class="text-lg font-semibold">${plant.name}</h3>
    <p class="text-sm text-gray-600 mb-3">${plant.description ? plant.description.substring(0, 80) + '...' : 'No description available.'}</p>
    <p class="text-xl font-bold text-green-700 mb-3">
   ৳${price}</p>
   <button onclick="event.stopPropagation(); addToCart('${plant.id}')"
   class="w-full bg-green-700 text-white py-2 rounded-lg font-bold hover:bg-green-800 transition">
   Add to Cart
         </button>
         </div> `;
};
// modal logic
const openModal = async (plantId) => {
    modalElement.classList.remove('hidden');
    setTimeout( () => {
        modalContenBox.classList.remove('scale-95', 'opacity-0');
    }, 10);

    modalBody.innerHTML = '<p class="text-center text-lg py-10">Loading plant details...</p>';
    
    const plant = await fetchData(API.plantsDetails(plantId));

    if(!plant || !plant.id) {
        modalBody.innerHTML = '<p class="text-red-500 text-center text-lg py-10">Details not found!</p>';
        return;
    }

    modalBody.innerHTML = `
    <div class="text-center pb-4 border-b">
    <img src="${plant.image || 'https://via.placeholder.com/200'}" alt="${plant.name}" class="w-40 h-40 object-cover rounded-full mx-auto mb-3 border-4 border-green-500">
    <h3 class="text-3xl font-bold text-green-700">${plant.name}</h3> 
    <p class="text-lg text-gray-600">৳${plant.price || 'N/A'}</p>
    </div>
    <div class="mt-4 space-y-3">
    <p><span class="font-semibold">Category:</span> ${plant.description || 'No detailed description available.'}</p>
    </div>
   <div class="mt-6 text-center">
   <button onclick="addToCart('${plant.id}'); closeModal()"
   class="bg-green-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-green-700">
   Add to Cart
   </button>
    </div> `;
};

const closeModal = () => {
    modalContenBox.classList.remove ('scale-100', 'opacity-100');
    modalContenBox.classList.add('scale-95', 'opacity-0');
    setTimeout (() => {
        modalElement.classList.add('hidden');
    }, 300);
};
// cart management logic
// -------------------------------
const addToCart = async (plantId) => {
    const existingItem =cart.find(item => item.id === plantId);
    if(existingItem) {
        existingItem.quantity += 1;
    }  else {
        const plant = await fetchData(API.plantsDetails(plantId));
        if (!plant) return;

        const price = parseFloat(plant.price);
        cart.push({id: plant.id, name:plant.name,
            price: price, quantity: 1 });
    }
    updateCartDisplay();
}


// fixed functionality
const removeItemFromCart = (plantId) => {
    const existingItemIndex = cart.findIndex(item => item.id === plantId);

    if(existingItemIndex > -1) {
        if (cart[existingItemIndex].quantity > 1) {
            cart[existingItemIndex].quantity -= 1;
        }  else {
            cart.splice(existingItemIndex, 1);
        }
    }
    updateCartDisplay();
};

const updateCartDisplay = () => {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500">Cart is empty.</p>';
    }  else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
        total += itemTotal;

    cartItemsContainer.innerHTML += `
    <div class="flex justify-between items-center border-b pb-2">
    <div class="flex-1 pr-2">
    <p class="font-semibold">${item.name}</p>
    <p class="text-sm text-gray-500">${item.quantity} x ৳${item.price.toFixed(2)}</p>
    </div>
    <span class="font-bold text-green-700 mr-3">৳${itemTotal.toFixed(2)}</span>
    
    <button onclick="removeItemFromCart('${item.id}')"
    class="text-red-500 hover:text-red-700 font-bold text-lg leading-none p-1">
    &times;
             </button>
             </div>`;
        });
    }
    cartTotalElement.innerText = `৳${total.toFixed(2)}`;
};

document.addEventListener('DOMContentLoaded', loadCategories);