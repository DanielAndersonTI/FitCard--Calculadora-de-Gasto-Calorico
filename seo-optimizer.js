// SEO Optimization
document.addEventListener('DOMContentLoaded', function() {
    // Dynamic title and meta description for result page
    if (window.location.pathname.includes('result.html')) {
        const dados = JSON.parse(localStorage.getItem('resultadoFitcard'));
        if (dados) {
            // Update title dynamically
            document.title = `Resultado: ${dados.calorias} calorias em ${dados.atividade} | Fitcard`;
            
            // Update meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', 
                    `Queimou ${dados.calorias} calorias em ${dados.tempoOriginal} ${dados.unidade} de ${dados.atividade}. Distância: ${dados.distancia}km. Baixe seu card!`
                );
            }
        }
    }
    
    // Track user engagement
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage++;
        if (timeOnPage === 10) { // 10 seconds
            console.log('User engaged with page');
            // Aqui você pode enviar para Google Analytics
        }
    }, 1000);
});

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        'calculator.js',
        'result.js',
        'https://cdn.tailwindcss.com'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.js') ? 'script' : 'style';
        document.head.appendChild(link);
    });
}