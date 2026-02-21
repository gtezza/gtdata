/**
 * GT Data Consulting - YouTube Integration
 * Carga dinámica de los últimos 4 videos del canal oficial.
 */

// Configuración - El usuario debe reemplazar su API Key aquí
const YOUTUBE_CONFIG = {
    apiKey: 'AIzaSyA1qpKqQhenmrs4f4pYsEeaPyakXKsLvbw', // Es necesaria una Public API Key (AIza...)
    channelId: 'UCdZBFWqoX6e6Wc5qelx2b4q',
    maxResults: 4
};

async function fetchYouTubeVideos() {
    const container = document.getElementById('youtube-videos-container');
    const section = document.getElementById('youtube-section');

    if (!container || !section) return;

    // Si no hay API Key configurada, ocultamos la sección por defecto (seguridad y limpieza)
    if (YOUTUBE_CONFIG.apiKey === 'REEMPLAZAR_CON_TU_API_KEY') {
        section.classList.add('hidden');
        console.warn('YouTube Integration: API Key no configurada. La sección de videos está oculta.');
        return;
    }

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_CONFIG.apiKey}&channelId=${YOUTUBE_CONFIG.channelId}&part=snippet,id&order=date&maxResults=${YOUTUBE_CONFIG.maxResults}&type=video`);

        if (!response.ok) throw new Error('Error al conectar con la API de YouTube');

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            section.classList.add('hidden');
            return;
        }

        renderVideos(data.items);
        section.classList.remove('hidden');

    } catch (error) {
        console.error('YouTube Integration Error:', error);
        section.classList.add('hidden');
    }
}

function renderVideos(videos) {
    const container = document.getElementById('youtube-videos-container');
    container.innerHTML = '';

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.high.url;
        const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const card = `
            <div class="group bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all shadow-xl">
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="block relative aspect-video overflow-hidden">
                    <img src="${thumbnail}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${title}">
                    <div class="absolute inset-0 bg-background-dark/20 group-hover:bg-transparent transition-all flex items-center justify-center">
                        <div class="w-12 h-12 bg-primary/90 text-background-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                            <span class="material-symbols-outlined font-black">play_arrow</span>
                        </div>
                    </div>
                </a>
                <div class="p-6">
                    <p class="text-primary text-[10px] font-bold uppercase tracking-widest mb-2">${publishedAt}</p>
                    <h4 class="text-white font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors h-12">
                        ${title}
                    </h4>
                    <div class="mt-4 flex items-center gap-2 text-slate-500 text-xs">
                        <span class="material-symbols-outlined text-sm">visibility</span>
                        <span>Ver en YouTube</span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', fetchYouTubeVideos);
