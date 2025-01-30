console.log("Let's write JavaScript")
let currentSong = new Audio
let songs

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/assets/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause=false) => {
    currentSong.src = "/assets/songs/" + track
    if (!pause) {
        currentSong.play()
        play.src = "/assets/icons/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function main() {

    //get all the songs
    songs = await getSongs()

    playMusic(songs[0], true)

    //display all the songs in the library
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class="flex align-items-center">
                <div class="songLeft flex justify-center align-items-center">
                  <img class="invert" src="/assets/icons/music.svg" alt="">
                  <div class="info">
                    <div class="songName">${song.replaceAll("%20", " ")}</div>
                    <div class="singerName">Singer Name</div>
                  </div>
                </div>
                <div class="songRight">
                  <img class="invert" src="/assets/icons/play.svg" alt="">
                </div>
              </li>`
    }
    
    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });

    // Attach an event listener to play, previous and next song
    play.addEventListener("click", ()=> {
        if(currentSong.paused) {
            currentSong.play()
            play.src = "/assets/icons/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "/assets/icons/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${
            secondsToMinutesSeconds(currentSong.currentTime)} : ${
                secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) *100 + "%";
    })

    // Add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=> {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)* percent) / 100
    })

    // Add an eventlistener to hemburger
    document.querySelector(".hemburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = 0;
    })

    // Add an eventlistener to close
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-150%";
    })

    // Add an eventlistener to next button
    next.addEventListener("click", e => {
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1) >= 0) {
            playMusic(songs[index+1])
        }
    })

    // Add an eventlistener to next button
    previous.addEventListener("click", e => {
        console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1) < songs.length) {
            playMusic(songs[index+1])
        }
    })

    
}

main()