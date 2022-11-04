let playgroundSize = [
    {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
]


function lastElement(array){return array[array.length-1]}

function preLastElement(array){return array[array.length-2]}

function createCard(id){
    const card = document.createElement('div');
    for(let [key,value] of Object.entries(id)){
        card.id = `${key}:${value}`
    }

    card.classList.add('card');
    card.innerHTML = `<p>${id.number}</p>`;
    
    return card;
}

function createPlayground(){
    const playground = document.createElement('div');

    playground.classList.add('playground');

    playground.addEventListener('click', function(e){
        if(e.target.closest('.card.opened')){
            console.log(pressedCards);
            return
        }
        if(e.target.closest('.card')){
            e.target.closest('.card').classList.toggle('pressed')
            checkPressedCards()
        }
        
    })

    return playground;
}

let pressedCards = 0;
function checkPressedCards(){
    pressedCards++
    let pressedCardsElements = document.querySelectorAll('.pressed');
    console.log(pressedCards)
    console.log(pressedCardsElements)

    if((pressedCards == 2) && (pressedCardsElements.length == 2)){
        if(lastElement(pressedCardsElements).id == preLastElement(pressedCardsElements).id){
            for(let element of pressedCardsElements){
                element.classList.add('opened');
                element.classList.remove('pressed');
            }
        }
        pressedCards = 0;
        for(let element of pressedCardsElements){
            element.classList.remove('pressed')
            element.classList.add('pressed-anim')
            setTimeout(() => {
                element.classList.remove('pressed-anim')
            }, 1000);
        }
    }
    if(pressedCardsElements.length == 0){
        pressedCards = 0;
    } 
}

function createNumbersForCard(){        
    let numbers = [];
    const arraySize = playgroundSize.length/2
    console.log(arraySize)
    for(let i = 0; i < arraySize; i++){
        let num = Math.round(Math.random()*100);
        numbers.push(num);
    }
    numbers = [...numbers, ...numbers]
    console.log(numbers);
    let newNumbers = shuffleArray(numbers);
    console.log(newNumbers);
    return numbers;
}

function createApp(){
    const playground = createPlayground();
    const app = document.querySelector('#app');
    let numbersForCards = createNumbersForCard();
    

    for(let i in playgroundSize){
        playgroundSize[i].number = numbersForCards[i];
        playground.append(createCard(playgroundSize[i]));
        
    }

    app.append(playground);
    createNumbersForCard()

    observeVictory()
}
createApp();

function shuffleArray(array){
    let shuffledArray = array.sort((a, b) => 0.5 - Math.random());
    return shuffledArray;
}

function observeVictory(){
    const allUnlockedElements = document.getElementsByClassName('opened');
    let victory = setInterval(() => {
        if(allUnlockedElements.length == playgroundSize.length){
            alert('Ура, победа');
            clearInterval(victory);
        }
    }, 200);
}