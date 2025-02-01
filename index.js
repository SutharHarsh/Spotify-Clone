console.log("Let's write JavaScript")
let currentSong = new Audio;
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1])
        }
    }

    //display all the songs in the library
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class="flex align-items-center">
                <div class="songLeft flex justify-center align-items-center">
                  <img class="invert" src="/assets/icons/music.svg" alt="">
                  <div class="info">
                    <div class="songName">${song.replaceAll("%20", " ")}</div>
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

const playMusic = (track, pause = false) => {
    currentSong.src = `${currFolder}` + track
    if (!pause) {
        currentSong.play()
        play.src = "/assets/icons/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    console.log("Display Albums");
    let a = await fetch("assets/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("assets/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/assets/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response.descri)
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card rounded p-1">
              <div class="playbt">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#00d520"
                  viewBox="0 0 24 24"
                  width="50"
                  height="50"
                  color="#000000"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <img
                class="rounded"
                src="/assets/songs/${folder}/cover.jpeg"
                alt="card1"
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div> `
        }
        
    }
    // console.log(div)
}

async function main() {

    //get all the songs
    songs = await getSongs("assets/songs/Friendship/");

    // Display all the albums on the page
    await displayAlbums();

    playMusic(songs[0], true)

    // Attach an event listener to play, previous and next song
    play.addEventListener("click", () => {
        if (currentSong.paused) {
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
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} : ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
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
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) >= 0) {
            playMusic(songs[index + 1])
        }
    })

    // Add an eventlistener to next button
    previous.addEventListener("click", e => {
        console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Load the playlist whenever card is cliked!
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`/assets/songs/${item.currentTarget.dataset.folder}/`)
            playMusic(songs[0])
        })
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


}

main()