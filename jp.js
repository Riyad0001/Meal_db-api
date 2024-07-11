let input = document.querySelector('.meal-input');
let mealList = document.querySelector('#list');
let errorText = document.querySelector('#error-text');
let submit = document.querySelector('.search');
let random = document.querySelector('.random');
let favList = document.querySelector('.fav-list');
let greet = document.querySelector('#greet');


submit.addEventListener('click' , function(){
    if(input.value.length === 0){
        errorText.innerHTML = 'Input can not be Empty !!!';
        mealList.innerHTML='';
        greet.innerHTML='';
        return;
    }
   getMealList();

});



function getMealList(){
    let searchInputTxt = input.value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {                                 

                html += `                                                            
                
                    <div class = "meal-item" data-id = "${meal.idMeal}">                          
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">

                            <h3>${meal.strMeal}</h3> 
                            
                            
                        </div>
                        
                        <button onclick="getData('${meal.idMeal}')" class="det">View Details</button>
                        
                    </div>
                
                `;
            });
            greeting();
            errorText.innerHTML = '';
            mealList.classList.remove('notFound');
        } else{
            errorText.innerHTML = '';
            html = "!!! Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}





function greeting(){
    greet.innerHTML = '$$---  Thanks For with Us ---$$';
    return;
}

function getData(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                let meal = data.meals[0];
                let modal = document.getElementById('mealDetailsModal');
                modal.querySelector('.det').innerHTML = `
                    <h2>${meal.strMeal}</h2>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p><strong>Category:</strong> ${meal.strCategory}</p>
                    <p><strong>Area:</strong> ${meal.strArea}</p>
                    
                    <ul>
                        ${getIngredientsList(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                `;
                showModal(modal);
            } else {
                console.error('No meal details found');
            }
        })
        .catch(error => {
            console.error('Error fetching meal details:', error);
        });
}

function getIngredientsList(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    return ingredients;
}

function showModal(modal) {
    modal.style.display = 'block';
    modal.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.onclick = function(event) {
    let modal = document.getElementById('mealDetailsModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}