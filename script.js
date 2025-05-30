// gambar ditekan penuh
function openFullImage(imgElement) {
  const overlay = document.getElementById("overlay");
  const fullImage = document.getElementById("full-image");
  fullImage.src = imgElement.src;
  overlay.style.display = "flex";
}

function closeFullImage() {
  document.getElementById("overlay").style.display = "none";
}

// membuat ketika isi komentar tidak pindah halaman dan buat upload komentar
  const form = document.getElementById("ucapan-form");
  const komentarContainer = document.querySelector(".komentar");
  const endpoint = "https://script.google.com/macros/s/AKfycbxT8OwlfrGILXT1M-0Csij_10GT2dALlXA9ziVugnsF0cdHcD69cIP7vrtgOJyqY078/exec";

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
      .then(res => res.json())
      .then(data => {
        komentarContainer.innerHTML = "";
        data.forEach(item => {
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
      ucapan: form.ucapan.value
    };

    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(formData)
    })
    .then(res => res.text())
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


  // import music
  let player;
  let isPlaying = false;

  // Load YouTube API Player
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtubeIframe', {
      events: {
        'onReady': onPlayerReady
      }
    });
  }

  function onPlayerReady(event) {
    const btn = document.getElementById('playPauseBtn');
    const icon = document.getElementById('playPauseIcon');

    btn.addEventListener('click', () => {
      if (isPlaying) {
        player.pauseVideo();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
      } else {
        player.playVideo();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
      }
      isPlaying = !isPlaying;
    });
  }

  // Tampilkan modal saat tombol music diklik
  document.getElementById('openMusicModal').addEventListener('click', () => {
    const musicModal = new bootstrap.Modal(document.getElementById('musicModal'));
    musicModal.show();
  });

