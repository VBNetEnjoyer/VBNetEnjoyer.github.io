let playgroundSize = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
]
let pressedCards = 0;
const playground = createPlayground();

function createCard(id, cardContent){
    const card = document.createElement('div');
    for(let [key,value] of Object.entries(id)){
        card.id = `${key}:${value}`
    }

    card.classList.add('card');
    card.innerHTML = `<p>${id.number}</p>`;

    card.addEventListener('click', function listener(e){
        card.classList.toggle('pressed')
        pressedCards++;
        checkPressedCards()
    })
    
    return card;
}


function createPlayground(){
    const playground = document.createElement('div');

    playground.classList.add('playground');

    return playground;
}

function createApp(){
    const app = document.querySelector('#app');
    let numbersForCards = createNumbersForCard();

    for(let i in playgroundSize){
        playgroundSize[i].number = numbersForCards[i];
        playground.append(createCard(playgroundSize[i]));
        
    }

    app.append(playground);
    createNumbersForCard()
}

function checkPressedCards(){
    let pressedCardsElements = document.querySelectorAll('.pressed');
    console.log(pressedCards)
    console.log(pressedCardsElements)

    if(pressedCards == 2){
        if(pressedCardsElements[0].id == pressedCardsElements[1].id){
            for(let element of pressedCardsElements){
                element.classList.add('opened');
                element.classList.remove('pressed');
                element.removeEventListener('click',this)
            }
        }
        pressedCards = 0;
        for(let element of pressedCardsElements){
            setTimeout(()=>{
                element.classList.remove('pressed')
            },1000)
        }
    }
}



function createNumbersForCard(){        
    const numbers = [];
    const arraySize = playgroundSize.length/2
    console.log(arraySize)
    for(let i = 0; i < arraySize; i++){
        let num = Math.round(Math.random()*100);
        numbers.push(num);
    }
    for(let i in numbers){
        numbers.push(numbers[i]);
    }
    console.log(numbers);
    let newNumbers = shuffleArray(numbers);
    console.log(newNumbers);
    return numbers;
}

function shuffleArray(array){
    let shuffledArray = array.sort((a, b) => 0.5 - Math.random());
    return shuffledArray;
}
createApp();


