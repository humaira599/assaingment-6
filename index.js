const categoryList = document.getElementById('category-list');
const plantContainer = document.getElementById('plant-container');
let currentCaregoryId = null;

const loadcategories = async () => {
    const URL = 'https://openapi.programming-hero.com/api/categories';
    const res = await fetch(URL);
    const data = await res.json();
}

data.data.forEach(category => {
    const button = document.createElement ('button');
button.innerText = category.category;
button.classList.add('w-full', 'text-left', 'p-2', 'rounded', 'hover:bg:gray-100', 'text-gray-700', 'mb-1');
button.onclick =() => {
    document.querySelectorAll
    ('#category-list button').forEatch(btn =>
        btn.classList.replace
    ('bg-green-600',
        'hover:bg-gray-100'
    ) ) ;
    button.classList.replace
    ('hover:bg-gray-100', 'bg-green-600');
    button.classList.add('text-white');

    currentCaregoryId = category.id;
    loadPlansByCategory(category.id);
}  }  );
