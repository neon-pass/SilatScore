// 1. INJEKSI GAYA CSS (STYLE)
const styleEfek = document.createElement('style');
styleEfek.innerHTML = `
    #rondeTransitionOverlay {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: radial-gradient(circle, rgba(20,20,20,0.85) 0%, rgba(0,0,0,1) 100%);
        backdrop-filter: blur(10px); z-index: 10000;
        display: flex; flex-direction: column; justify-content: center; align-items: center;
        opacity: 0; pointer-events: none; transition: opacity 0.4s ease-in-out; overflow: hidden;
    }
    #rondeTransitionOverlay.show { opacity: 1; pointer-events: all; }
    #rondeTransitionOverlay.exit { opacity: 0; pointer-events: none; transition: opacity 0.8s ease-in-out; }
    
    .logo-wrapper { transform: translateX(150vw); transition: transform 0s; }
    .text-wrapper { transform: translateX(-150vw); transition: transform 0s; }
    
    #rondeTransitionOverlay.show .logo-wrapper,
    #rondeTransitionOverlay.show .text-wrapper {
        transform: translateX(0);
        transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
    }
    
    #rondeTransitionOverlay.exit .logo-wrapper { transform: translateX(-150vw); transition: transform 0.6s ease-in; }
    #rondeTransitionOverlay.exit .text-wrapper { transform: translateX(150vw); transition: transform 0.6s ease-in; }
    
    .logo-wrapper img {
        width: 280px; margin-bottom: 30px; filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.3));
        animation: pulseLogo 1.5s infinite alternate;
    }
    .text-wrapper h1 {
        font-size: 8rem; color: #ffc107; font-family: 'Arial Black', 'FontGadugi', sans-serif;
        text-transform: uppercase; font-weight: 900; letter-spacing: 10px;
        text-shadow: 0px 10px 40px rgba(255, 193, 7, 0.8); margin: 0;
    }
    @keyframes pulseLogo {
        0%   { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.2)); }
        100% { transform: scale(1.1); filter: drop-shadow(0 0 40px rgba(255, 193, 7, 0.8)); }
    }
`;
document.head.appendChild(styleEfek);

// 2. INJEKSI ELEMEN HTML
const overlayEfek = document.createElement('div');
overlayEfek.id = 'rondeTransitionOverlay';
overlayEfek.innerHTML = `
    <div class="logo-wrapper">
        <!-- Pastikan path gambarnya benar ya -->
        <img src="assets/icons/logo-duniaeventindo.png" alt="Logo Sponsor">
    </div>
    <div class="text-wrapper">
        <h1 id="transitionRondeText">RONDE X</h1>
    </div>
`;

// Pasang HTML siluman ini saat halaman siap
document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(overlayEfek);
});

// 3. FUNGSI PEMICU ANIMASI (Bisa Dipanggil dari File Lain)
window.mainkanEfekTransisiRonde = function(rondeVal) {
    let overlay = document.getElementById('rondeTransitionOverlay');
    let textEl = document.getElementById('transitionRondeText');
    
    if(!overlay || !textEl) return; // Mencegah error jika belum ter-load

    overlay.classList.remove('show', 'exit');
    textEl.innerText = "RONDE " + rondeVal;
    
    void overlay.offsetWidth; // Reset status animasi
    
    overlay.classList.add('show');
    
    setTimeout(() => {
        overlay.classList.remove('show');
        overlay.classList.add('exit');
        setTimeout(() => {
            overlay.classList.remove('exit');
        }, 800);
    }, 1500); // Tampil 2.5 Detik
};