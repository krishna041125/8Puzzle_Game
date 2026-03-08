let playerName = "Player"


let currentDifficulty="easy"

const homeScreen=document.getElementById("homeScreen")
const gameScreen=document.getElementById("gameScreen")

const boardDiv=document.getElementById("board")

const stepsText=document.getElementById("steps")
const timeText=document.getElementById("time")
const mdText=document.getElementById("md")

const card=document.getElementById("card")

let timerInterval=null
let startTimestamp=null
let gameSolved=false

// Timer
function startTimer(){
    clearInterval(timerInterval)
    startTimestamp=Date.now()
    timerInterval=setInterval(()=>{
        let seconds=Math.floor((Date.now()-startTimestamp)/1000)
        timeText.innerText=seconds
    },1000)
}

function stopTimer(){
    clearInterval(timerInterval)
}

// DRAW BOARD FUNCTION
function draw(data){
    boardDiv.innerHTML=""
    let zero=data.board.indexOf(0)
    data.board.forEach((value,index)=>{
        let tile=document.createElement("div")
        tile.className="tile"

        
        if(value!==0){
            tile.innerText=value
            
            if(
                Math.abs(Math.floor(zero/3)-Math.floor(index/3)) +
                Math.abs((zero%3)-(index%3)) === 1
            ){
                tile.classList.add("movable")
                tile.onclick=()=>move(index)
            }
        }

        else{
            tile.classList.add("empty")
        }
        
        boardDiv.appendChild(tile)
    })
    stepsText.innerText=data.steps
    mdText.innerText=data.md

    if(data.solved===true && !gameSolved){
        gameSolved=true
        stopTimer()
        showCard(data)
    }
}


//Start Game
function startGame(level){
    let name=prompt("Enter Your Name:")

    if(!name || name.trim()==="" || name==="null"){
        playerName="Player"
    }
    else{
        playerName=name.trim()
    }

    localStorage.setItem("playerName",playerName)
    currentDifficulty=level
    homeScreen.classList.add("hidden")
    gameScreen.classList.remove("hidden")
    card.classList.add("hidden")
    gameSolved=false
    shuffle(level)
    startTimer()
}


function shuffle(level){
    fetch("/shuffle/"+level,{cache:"no-store"})
    .then(res=>res.json())
    .then(data=>{
        draw(data)
        startTimer()
    })
}


function move(index){
    if(gameSolved) return
    fetch("/move",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({i:index})
    })
    .then(res=>res.json())
    .then(draw)
}


function undo(){
    if(gameSolved) return
    fetch("/undo")
    .then(res=>res.json())
    .then(draw)
}


function restart(){
    card.classList.add("hidden")
    gameSolved=false
    fetch("/restart")
    .then(res=>res.json())
    .then(data=>{
        draw(data)
        startTimer()
    })
}


function autoSolve(){
    if(gameSolved) return
    fetch("/solve")
    .then(res=>res.json())
    .then(data=>{
        let states=data.states
        let i=0
        let interval=setInterval(()=>{
            draw(states[i])
            i++

            if(i>=states.length){
                clearInterval(interval)
            }
        },500)
    })
}


function goHome(){
    gameScreen.classList.add("hidden")
    homeScreen.classList.remove("hidden")
    card.classList.add("hidden")
    stopTimer()
}


async function showCard(data){
    card.classList.remove("hidden")
    let rating="Average"

    if(data.steps<=20) rating="Perfect"
    else if(data.steps<=30) rating="Good"
    else rating="Needs Practice"

    document.getElementById("finalSteps").innerText=
        "Steps: "+data.steps+" ("+rating+")"

    document.getElementById("finalTime").innerText=
        "Time: "+timeText.innerText+" sec"

    let sound=document.getElementById("winSound")

    if(sound){

        sound.play()

    }

    await fetch("/save_score",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name:playerName,
            steps:data.steps,
            time:timeText.innerText,
            difficulty:currentDifficulty
        })
    })
    loadLeaderboard()
}


function loadLeaderboard(){
    fetch("/leaderboard")
    .then(res=>res.json())
    .then(data=>{
        let table=document.getElementById("leaderboard")
        table.innerHTML=
        `<tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Steps</th>
        <th>Time</th>
        <th>Level</th>
        </tr>`

        data.forEach((row,index)=>{
            table.innerHTML+=
            `<tr>
            <td>${index+1}</td>
            <td>${row.name}</td>
            <td>${row.steps}</td>
            <td>${row.time}</td>
            <td>${row.difficulty}</td>
            </tr>`
        })

        if(data.length>0){
            document.getElementById("bestCard")
            .classList.remove("hidden")
            document.getElementById("bestName")
            .innerText="Player: "+data[0].name
            document.getElementById("bestSteps")
            .innerText="Steps: "+data[0].steps
            document.getElementById("bestTime")
            .innerText="Time: "+data[0].time+" sec"
            document.getElementById("bestLevel")
            .innerText="Level: "+data[0].difficulty
        }
    })
}


document.addEventListener("keydown",function(e){
    if(gameSolved) return
    let tiles=[...document.querySelectorAll(".tile")]
    let emptyIndex=tiles.findIndex(t=>t.classList.contains("empty"))
    let moveIndex=null
    if(e.key==="ArrowUp") moveIndex=emptyIndex+3
    if(e.key==="ArrowDown") moveIndex=emptyIndex-3
    if(e.key==="ArrowLeft") moveIndex=emptyIndex+1
    if(e.key==="ArrowRight") moveIndex=emptyIndex-1
    if(moveIndex>=0 && moveIndex<9){
       move(moveIndex)
    }
})

loadLeaderboard()
