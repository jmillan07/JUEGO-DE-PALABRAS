const tileDisplay = document.querySelector('.tile-container')
const keybord = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

let wordle 

const getWordle = ()=>{
    fetch('http://localhost:8000/word')
        .then(response => response.json())
        .then(json => {
            console.log(json)
            wordle = json
        })
        .catch(err => console.log(err))
}

getWordle()

const keys = [
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'ENTER',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm',
    '<<',
]


const guessRows = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElemetn = document.createElement('div')
    rowElemetn.setAttribute('id','guessRow-'+ guessRowIndex)
    guessRow.forEach((guess, guessIndex)=> {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-'+ guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElemetn.append(tileElement)
    })

    tileDisplay.append(rowElemetn)
})


keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent= key
    buttonElement.setAttribute('id',key)
    buttonElement.addEventListener('click', ()=>handleClick(key))
    keybord.append(buttonElement)
})

const handleClick = (letter) => {
    console.log('clicked',letter)
    if (letter === '<<'){
        deleteLetter()
        console.log('guessRow',guessRows)
        return
    }
    if (letter === 'ENTER'){
        checkRow()
        console.log('guessRow',guessRows)
        return
    }
    addLetter(letter)
    console.log('guessRow',guessRows)
}

const addLetter =(letter)=>{
    if(currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-'+currentRow+'-tile-'+ currentTile)
        tile.textContent= letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
    }
}

const deleteLetter = () => {
    if( currentTile > 0 ){
        currentTile--
        const tile = document.getElementById('guessRow-'+currentRow+'-tile-'+ currentTile)   
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''   
        tile.setAttribute('data', '')
    }
}

const checkRow =()=> {
    const guess = guessRows[currentRow].join('')
    flipTile()
    if (currentTile > 4) {
        
        console.log('guess is '+guess,'worlde is ' + wordle)
        if(wordle == guess){
            showmessage('Magnificent')
            isGameOver = true
            return
        }else{
            if(currentRow >= 5 ){
                isGameOver = false
                showmessage('Game Over')
                return
            }
            if(currentRow < 5){
                currentRow++
                currentTile = 0
            }
        }
    }
}

const showmessage =(message)=>{
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(()=>{
        messageDisplay.removeChild(messageElement)
    },2000)
}

const addColorToKey =(keyLetter, color)=>{
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const flipTile = ()=> {
    const rowTiles = document.querySelector('#guessRow-'+currentRow).childNodes
    let checkWordle = wordle
    const guess = []

    rowTiles.forEach(tile =>{
        guess.push({letter : tile.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, index)=>{
        if(guess.letter=== wordle[index]){
            guess.color ='green-overlay'
            checkWordle = checkWordle.replace(guess.letter,'')
        }
    })

    guess.forEach(guess=>{
        if(checkWordle.includes(guess.letter)){
            guess.color='yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter,'')
        }
    })

    rowTiles.forEach((tile,index) => {
        setTimeout(()=>{
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter,guess[index].color)
        },500*index)
        
    })
}