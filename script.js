// === script.js (update) ===

// (1) Tambahkan definisi rootElement di paling atas:
const rootElement = document.documentElement;

// fungsi untuk menampilkan gambar full-screen (sama seperti sebelumnya)
function openFullImage(imgElement) {
  const overlay = document.getElementById("overlay");
  const fullImage = document.getElementById("full-image");
  fullImage.src = imgElement.src;
  overlay.style.display = "flex";
}

function closeFullImage() {
  document.getElementById("overlay").style.display = "none";
}

// (2) Fungsi untuk mematikan/menyalakan tombol scroll dan langsung play YouTube:
function disableScroll() {
  // kunci posisi scroll agar tidak bergerak
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  // 1. Hilangkan tombol musik
  const button_music = document.getElementById("openMusicModal");
  if (button_music) {
    button_music.style.display = "none";
  }
  window.onscroll = function () {
    window.scrollTo(scrollTop, scrollLeft);
  };
  rootElement.style.scrollBehavior = "auto";
}

function enableScroll() {
  // buka kembali scrolling
  window.onscroll = null;
  rootElement.style.scrollBehavior = "smooth";

  // jika player sudah siap, langsung putar videonya
  if (player && typeof player.playVideo === "function") {
    player.playVideo();
    isPlaying = true;
  }
  // 1. Hilangkan tombol
  const button = document.getElementById("bukaUndanganBtn");
  if (button) {
    button.style.display = "none";
  }

  // munculkan tombol music
  const button_music = document.getElementById("openMusicModal");
  if (button_music) {
    button_music.style.display = "block";
  }

  // 2. Aktifkan scroll jika sebelumnya dikunci
  document.body.style.overflow = "auto";
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';


  // 3. Masuk fullscreen (jika diizinkan oleh browser)
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

//–– kode komentar & fetch (sama seperti sebelumya) ––
const form = document.getElementById("ucapan-form");
const komentarContainer = document.querySelector(".komentar");
const endpoint =
  "https://script.google.com/macros/s/AKfycbxT8OwlfrGILXT1M-0Csij_10GT2dALlXA9ziVugnsF0cdHcD69cIP7vrtgOJyqY078/exec";

function tampilkanLoading(state) {
  if (state) {
    form.querySelector("button").innerText = "Mengirim...";
    form.querySelector("button").disabled = true;
  } else {
    form.querySelector("button").innerText = "Kirim";
    form.querySelector("button").disabled = false;
  }
}

function fetchKomentar() {
  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      komentarContainer.innerHTML = "";
      data.forEach((item) => {
        const div = document.createElement("div");
        div.className = "col-12 py-2 m-auto border-bottom border-dark";
        div.innerHTML = `<div class="fs-6">${item.nama}</div><small>${item.ucapan}</small>`;
        komentarContainer.appendChild(div);
      });
    });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  tampilkanLoading(true);

  const formData = {
    nama: form.nama.value,
    ucapan: form.ucapan.value,
  };

  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(formData),
  })
    .then((res) => res.text())
    .then(() => {
      form.reset();
      tampilkanLoading(false);
      fetchKomentar();
      alert("Ucapan berhasil dikirim!");
    })
    .catch(() => {
      tampilkanLoading(false);
      alert("Gagal mengirim ucapan.");
    });
});

// Fetch komentar setiap 5 detik
setInterval(fetchKomentar, 5000);
fetchKomentar();

// (3) Kode YouTube IFrame API (sama prinsipnya seperti sebelum):
let player;
let isPlaying = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtubeIframe", {
    videoId: "XQ97zZ2fHRU", // Ganti dengan ID video Anda
    playerVars: {
      autoplay: 0, // jangan autoplay saat page load
      mute: 0,
      controls: 0,
      modestbranding: 1,
    },
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  const btn = document.getElementById("playPauseBtn");
  const icon = document.getElementById("playPauseIcon");

  btn.addEventListener("click", () => {
    if (isPlaying) {
      player.pauseVideo();
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    } else {
      player.playVideo();
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
    }
    isPlaying = !isPlaying;
  });
}

// Tampilkan modal musik saat tombol musik diklik
document.getElementById("openMusicModal").addEventListener("click", () => {
  const musicModal = new bootstrap.Modal(document.getElementById("musicModal"));
  musicModal.show();
});

// Matikan scroll saat halaman pertama kali dibuka
disableScroll();
