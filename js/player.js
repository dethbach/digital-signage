/* ======================================================
   CONFIG
====================================================== */
const config = {
  marqueeSpeed: 25,
  imageDuration: 5000
};

const supportedExt = ["jpg", "jpeg", "png", "mp4"];
const MAX_FILES = 50;


/* ======================================================
   MARQUEE
====================================================== */
fetch("media/Running%20Text.txt?ts=" + Date.now())
  .then(r => r.text())
  .then(text => {
    const marquee = document.querySelector(".marquee");
    const el = document.getElementById("marquee-text");

    const cleanText = text.trim();

    if (!cleanText) {
      document.querySelector(".screen").classList.add("no-marquee");
      marquee.style.display = "none";
      return;
    }

    el.textContent = cleanText.replace(/\n/g, "   •   ");
    el.style.animationDuration = config.marqueeSpeed + "s";
  })
  .catch(() => {
    document.querySelector(".marquee").style.display = "none";
    console.warn("Running Text.txt not found");
  });



/* ======================================================
   TOP (SLIDER IF MULTIPLE FILES)
====================================================== */
const topContainer = document.getElementById("top");
let topFiles = [];
let topIndex = 0;

supportedExt.forEach(ext => {
  for (let i = 1; i <= MAX_FILES; i++) {
    const file = `media/Top/${i}.${ext}`;

    fetch(file, { method: "HEAD" }).then(res => {
      if (res.ok) {
        topFiles.push(file);
        topFiles.sort();
      }
    });
  }
});

// start top after scan
setTimeout(() => {
  if (topFiles.length === 1) {
    playTopSingle();
  } else if (topFiles.length > 1) {
    playTopSlider();
  }
}, 1200);

function playTopSingle() {
  topContainer.innerHTML = "";
  const file = topFiles[0];

  if (file.endsWith(".mp4")) {
    const video = document.createElement("video");
    video.src = file;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    topContainer.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = file;
    topContainer.appendChild(img);
  }
}

function playTopSlider() {
  topContainer.innerHTML = "";
  const file = topFiles[topIndex];

  if (file.endsWith(".mp4")) {
    const video = document.createElement("video");
    video.src = file;
    video.autoplay = true;
    video.muted = false;
    video.volume = 5.0;
    video.playsInline = true;
    video.onended = nextTop;
    topContainer.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = file;
    topContainer.appendChild(img);
    setTimeout(nextTop, config.imageDuration);
  }
}

function nextTop() {
  topIndex = (topIndex + 1) % topFiles.length;
  playTopSlider();
}


/* ======================================================
   BOTTOM (SLIDER, ALL FILES)
====================================================== */
const bottomContainer = document.getElementById("bottom");
let bottomFiles = [];
let bottomIndex = 0;

supportedExt.forEach(ext => {
  for (let i = 1; i <= MAX_FILES; i++) {
    const file = `media/Bottom/${i}.${ext}`;

    fetch(file, { method: "HEAD" }).then(res => {
      if (res.ok) {
        bottomFiles.push(file);
        bottomFiles.sort();
      }
    });
  }
});

// start slider after scan
setTimeout(() => {
  if (bottomFiles.length > 0) {
    playBottom();
  } else {
    // bottom empty → top fullscreen
    document.querySelector(".screen").classList.add("no-bottom");
    console.warn("Bottom folder empty → Top fullscreen");
  }
}, 1200);


function playBottom() {
  bottomContainer.innerHTML = "";
  const file = bottomFiles[bottomIndex];

  if (file.endsWith(".mp4")) {
    const video = document.createElement("video");
    video.src = file;
    video.autoplay = true;
    video.muted = false;
    video.volume = 1.0;
    video.playsInline = true;
    video.onended = nextBottom;
    bottomContainer.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = file;
    bottomContainer.appendChild(img);
    setTimeout(nextBottom, config.imageDuration);
  }
}

function nextBottom() {
  bottomIndex = (bottomIndex + 1) % bottomFiles.length;
  playBottom();
}
