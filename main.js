function countPlaygroundSize(cols, rows){
    return cols*rows;
}

function createTitle(){
    const titleNode = document.createElement('div');
    titleNode.innerHTML = `
        <div class="title__container">Игра "Пары"</div>
    `
    return titleNode;
}

const DEF_ROWS = 4;
const DEF_COLS = 4;
const KEY_FOR_LOCAL_STORAGE = "KEY"

function createData(){
    // cols rows timer
    let data = [DEF_COLS, DEF_ROWS, 60];
    if(localStorage.getItem(KEY_FOR_LOCAL_STORAGE)){
        data = JSON.parse(localStorage.getItem(KEY_FOR_LOCAL_STORAGE));
    }
    
    function getData(){
        return data;
    }

    function updateData(newData){
        data = newData;
        localStorage.setItem(KEY_FOR_LOCAL_STORAGE, JSON.stringify(data));
    }

    return{
        getData,
        updateData,
    }
}

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

function createTimer(data){
    const timerWrapper = document.createElement('div');
    const timerCheckBox = document.createElement('input');
    const timerCheckBoxLabel = document.createElement('label');
    const timerSelector = document.createElement('select');
    
    timerCheckBoxLabel.setAttribute('for','timerCheckBox');
    timerCheckBoxLabel.textContent = 'Включить таймер';

    for(let i = 10; i < 130; i+=10){
        const option = document.createElement('option');
        option.value = i;
        if(i == data.getData()[2]){
            option.setAttribute('selected', true);
        }
        option.textContent = i;
        timerSelector.append(option);
    }

    timerWrapper.style.cssText= `
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    `;

    timerCheckBox.type = 'checkbox';
    timerCheckBox.id = 'timerCheckBox';
    timerCheckBox.style.marginRight = "8px";

    timerWrapper.append(timerCheckBox);
    timerWrapper.append(timerCheckBoxLabel);
    timerWrapper.append(timerSelector);

    function startTimer(count){
        while(timerWrapper.firstChild){
            timerWrapper.removeChild(timerWrapper.firstChild)
        }
        const timerText = document.createElement('p');
        const timerCounter = document.createElement('span');
        timerText.textContent = `Таймер: `;
        timerText.append(timerCounter);
        timerCounter.textContent = count;
        let timerInterval = setInterval(()=>{
            if(+timerCounter.textContent == 1) clearInterval(timerInterval);
            timerCounter.textContent = +timerCounter.textContent - 1;
        },1000)

        timerWrapper.append(timerText);
    }
    function hideTimer(){
        timerWrapper.style.display = 'none';
    }

    return{
        timerWrapper,
        timerCheckBox,
        timerSelector,
        startTimer,
        hideTimer,
    }
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
        markCardsAsOpened(pressedCards);
    }
    pressedCardsCount = 0;
    markCardsAsUncorrect(pressedCards);
}


function markCardsAsUncorrect(elementsToHide){
    for(let element of elementsToHide){
        element.classList.remove('pressed');
        element.classList.add('uncorrect');
        setTimeout(() => {
            element.classList.remove('uncorrect');
        }, 1000);
    }   
}

function markCardsAsOpened(elementToCheck){
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

function createSettings(data){
    const settingsContainer = document.createElement('div');
    settingsContainer.classList.add('settings');

    const colsSettings = document.createElement('select');
    colsSettings.id = 'cols-settings';

    const colsLabel = document.createElement('label');
    colsLabel.setAttribute('for','cols-settings');
    colsLabel.textContent = "Выберите количество столбцов";

    const rowsSettings = document.createElement('select');
    rowsSettings.id = 'rows-settings';

    const rowsLabel = document.createElement('label');
    rowsLabel.setAttribute('for','rows-settings');
    rowsLabel.textContent = "Выберите количество строк";

    const saveButton = document.createElement('button');
    saveButton.textContent = "Сохранить и запустить";

    const selectorsWrapper = document.createElement('div');
    selectorsWrapper.classList.add('settings__selectors-body');

    const settingsBody = document.createElement('div');
    settingsBody.classList.add('settings__body');

    const rowsAndColsElements = [2,4,6,8,10];
    for(let element of rowsAndColsElements){
        const option = document.createElement('option');
        option.textContent = element;
        option.value = element;
        if(element == data.getData()[0]){
            option.setAttribute('selected',true);
        }
        colsSettings.append(option.cloneNode(true));
    }
    for(let element of rowsAndColsElements){
        const option = document.createElement('option');
        option.textContent = element;
        option.value = element;
        if(element == data.getData()[1]){
            option.setAttribute('selected',true);
        }
        rowsSettings.append(option.cloneNode(true));
    }

    selectorsWrapper.append(rowsLabel);
    selectorsWrapper.append(rowsSettings);
    selectorsWrapper.append(colsLabel);
    selectorsWrapper.append(colsSettings);
    settingsBody.append(selectorsWrapper);
    settingsBody.append(saveButton);
    settingsContainer.append(settingsBody);

    function hideSettings(){
        selectorsWrapper.style.display = "none";
    }

    return{
        settingsContainer,
        rowsSettings,
        colsSettings,
        saveButton,
        hideSettings,
    }
}

function updatePlaygroundCards(playground, cols=DEF_COLS, rows=DEF_ROWS, addCards=true){
    while(playground.firstChild){
        playground.removeChild(playground.firstChild);
    }
    let playgroundSize = countPlaygroundSize(cols, rows);
    let numbersForCards = createNumbersForCard(playgroundSize);
    let rowsStringValue = '';
    let colsStringValue = '';
    for(let i = 0; i < rows; i++){
        rowsStringValue = rowsStringValue+"1fr ";
    }
    for(let i = 0; i < cols; i++){
        colsStringValue = colsStringValue+"1fr ";
    }
    playground.style.gridTemplateRows = rowsStringValue.trim();
    playground.style.gridTemplateColumns = colsStringValue.trim();
    if(!addCards) return;
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
    const timerCount = document.getElementsByTagName('span');
    let victory = setInterval(() => {
        if(allCards.length == 0) return;
        if(timerCount.length > 0){
            if(+timerCount[0].textContent == 0){
                showFinallDialog(false);
                clearInterval(victory);
            }
        }
        if(allUnlockedElements.length == allCards.length){
            showFinallDialog(true);
            clearInterval(victory);
        }
    }, 200);
}

function showFinallDialog(isWin){
    const finallDialog = createFinallDialog(isWin);
    const finallDialogNode = finallDialog.finallDialogWrapper;
    document.body.append(finallDialogNode); 
    finallDialog.showDialog();
}

function createFinallDialog(isWin){
    const finallDialogWrapper = document.createElement('div');
    finallDialogWrapper.classList.add('finall-dialog');

    const finallDialogBody = document.createElement('div');
    finallDialogBody.classList.add('finall-dialog__body');

    const finallDialogBackground = document.createElement('div');
    finallDialogBackground.classList.add('finall-dialog__background');
    
    const finallDialogTitle = document.createElement('div');
    finallDialogTitle.classList.add('finall-dialog__title');

    const finallDialogText = document.createElement('div');
    finallDialogText.classList.add('finall-dialog__text');

    const finallDialogButton = document.createElement('button');
    finallDialogButton.classList.add('finall-dialog__button');
    finallDialogButton.textContent = "Главное меню";

    if(isWin){
        finallDialogTitle.textContent = "Победа";
        finallDialogTitle.classList.add('green');
        finallDialogText.textContent = `Поздравля вы нашли все пары. 
        Нажмите на кнопку, чтобы вернуться в главное меню`;
    } else {
        finallDialogTitle.textContent = "Поражение";
        finallDialogTitle.classList.add('red');
        finallDialogText.textContent = `Время вышло. Вы не смогли найти все пары за отведенное время. 
        Нажмите на кнопку, чтобы вернуться в главное меню`;
    }

    finallDialogBody.append(finallDialogTitle);
    finallDialogBody.append(finallDialogText);
    finallDialogBody.append(finallDialogButton);

    finallDialogWrapper.append(finallDialogBody);
    finallDialogWrapper.append(finallDialogBackground);

    finallDialogWrapper.addEventListener(`click`,(e)=>{
        if(e.target.closest('.finall-dialog__button')){
            location.reload();
        }
        if(e.target.closest('.finall-dialog__background')){
            finallDialogBody.style.animationName = "finall-dialog-background";
            setTimeout(()=>{
                finallDialogBody.style.animationName = "none";
            }, 500)
        }
    })

    function showDialog(){
        finallDialogWrapper.style.display = 'block';
    }

    return{
        finallDialogWrapper,
        showDialog,
    }
}

function createApp(){
    const data = createData();
    const playground = createPlayground();
    const settings = createSettings(data);
    const app = document.querySelector('#app');
    const timer = createTimer(data); 
    const titleNode = createTitle();
    
    settings.settingsContainer.addEventListener(`click`,(e)=>{
        if(e.target.closest('.isRestart')){
            location.reload();
        }
        if(e.target.closest('button')){
            let rowsValue = settings.rowsSettings.value;
            let colsValue = settings.colsSettings.value;
            timer.timerCheckBox.checked ? timer.startTimer(timer.timerSelector.value) : timer.hideTimer();
            updatePlaygroundCards(playground, colsValue, rowsValue);
            data.updateData([colsValue, rowsValue, timer.timerSelector.value]);
            checkPressedCards();
            settings.saveButton.classList.add("isRestart");
            settings.saveButton.textContent = "< Главное меню";
            settings.hideSettings();
            titleNode.style.display = "none";
        }
    })
    
    updatePlaygroundCards(playground, data.getData()[0], data.getData()[1], false);
    settings.settingsContainer.append(timer.timerWrapper);
    app.append(settings.settingsContainer);
    app.append(playground);
    app.before(titleNode);
    createNumbersForCard();
    observeVictory();
}

window.createApp = createApp;