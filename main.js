function countPlaygroundSize(cols, rows){
    return cols*rows;
}
const DEF_ROWS = 4;
const DEF_COLS = 4;

function createCard(id){
    const card = document.createElement('div');
    for(let [key,value] of Object.entries(id)){
        card.id = `${key}:${value}`;
    }

    card.classList.add('card');
    const numberNode = document.createElement('p');
    numberNode.textContent = id.number;

    card.append(numberNode);
    
    return card;
}

function createPlayground(){
    const playground = document.createElement('div');

    playground.classList.add('playground');

    playground.addEventListener('click', function(e){
        if(e.target.closest('.card.opened')){
            return;
        }
        if(e.target.closest('.card')){
            e.target.closest('.card').classList.toggle('pressed');
            checkPressedCards();
        }
        
    })

    return playground;
}


let pressedCardsCount = 0;
function checkPressedCards(){
    pressedCardsCount++;
    let pressedCards = document.querySelectorAll('.pressed');

    if(pressedCards.length == 0) pressedCardsCount = 0;
    if((pressedCardsCount != 2) || (pressedCards.length != 2)) return;
    if(lastElementOfArray(pressedCards).id == preLastElementOfArray(pressedCards).id){
        checkCardsAsOpened(pressedCards);
    }
    pressedCardsCount = 0;
    hideElements(pressedCards);
}
function hideElements(elementsToHide){
    for(let element of elementsToHide){
        element.classList.remove('pressed');
        element.classList.add('uncorrect');
        setTimeout(() => {
            element.classList.remove('uncorrect');
        }, 1000);
    }   
}
function checkCardsAsOpened(elementToCheck){
    for(let element of elementToCheck){
        element.classList.add('opened');
        element.classList.remove('pressed');
    }
}

function createNumbersForCard(playgroundSize){        
    let numbers = [];
    const arraySize = playgroundSize/2;
    for(let i = 0; i < arraySize; i++){
        let num = Math.round(Math.random()*100);
        numbers.push(num);
    }
    numbers = [...numbers, ...numbers];
    let newNumbers = shuffleArray(numbers);
    return newNumbers;
}
function createSettings(){
    const settingsContainer = document.createElement('div');
    settingsContainer.classList.add('settings');

    const colsSettings = document.createElement('select');
    colsSettings.id = 'cols-settings';
    const colsLabel = document.createElement('label');
    colsLabel.for = 'cols-settings';
    colsLabel.textContent = "Выберите количество столбцов";
    const rowsSettings = document.createElement('select');
    rowsSettings.id = 'cols-settings';
    const rowsLabel = document.createElement('label');
    rowsLabel.for = 'rows-settings';
    rowsLabel.textContent = "Выберите количество строк";
    const saveButton = document.createElement('button');
    saveButton.textContent = "SAVE";

    const rowsAndColsElements = [2,3,4,5,6,7,8,9,10];
    for(let element of rowsAndColsElements){
        const option = document.createElement('option');
        option.textContent = element;
        option.value = element;
        if(element == 4){
            option.setAttribute('selected',true);
        }
        rowsSettings.append(option.cloneNode(true));
        colsSettings.append(option.cloneNode(true));
    }

    settingsContainer.append(rowsLabel);
    settingsContainer.append(rowsSettings);
    settingsContainer.append(colsLabel);
    settingsContainer.append(colsSettings);
    settingsContainer.append(saveButton);

    return{
        settingsContainer,
        rowsSettings,
        colsSettings,
        saveButton,
    }
}


function createApp(){
    const playground = createPlayground();
    const settings = createSettings();
    const app = document.querySelector('#app');

    settings.settingsContainer.addEventListener(`click`,(e)=>{
        if(e.target.closest('button')){
            let rowsValue = settings.rowsSettings.value;
            let rowsStringValue = '';
            let colsValue = settings.colsSettings.value;
            let colsStringValue = '';
            for(let i = 0; i < rowsValue; i++){
                rowsStringValue = rowsStringValue+"1fr ";
            }
            for(let i = 0; i < colsValue; i++){
                colsStringValue = colsStringValue+"1fr ";
            }
            playground.style.gridTemplateRows = rowsStringValue.trim();
            playground.style.gridTemplateColumns = colsStringValue.trim();
            updatePlaygroundCards(playground, colsValue, rowsValue);
        }
    })
    
    updatePlaygroundCards(playground);
    app.append(settings.settingsContainer);
    app.append(playground);
    createNumbersForCard();
    observeVictory();
}
window.createApp = createApp;

function updatePlaygroundCards(playground, cols=DEF_COLS, rows=DEF_ROWS){
    while(playground.firstChild){
        playground.removeChild(playground.firstChild);
    }
    let playgroundSize = countPlaygroundSize(cols, rows);
    let numbersForCards = createNumbersForCard(playgroundSize);
    for(let i in numbersForCards){
        let id = {number:numbersForCards[i]};
        playground.append(createCard(id));
    }
}

function shuffleArray(array){return array.sort((a, b) => 0.5 - Math.random())}

function lastElementOfArray(array){return array[array.length-1]}

function preLastElementOfArray(array){return array[array.length-2]}

function observeVictory(){
    const allUnlockedElements = document.getElementsByClassName('opened');
    const allCards = document.getElementsByClassName('card');
    let victory = setInterval(() => {
        if(allUnlockedElements.length == allCards.length){
            alert('Ура, победа');
            clearInterval(victory);
        }
    }, 200);
}