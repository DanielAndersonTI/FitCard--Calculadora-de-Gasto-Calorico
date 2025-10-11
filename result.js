document.addEventListener('DOMContentLoaded', () => {
    console.log('=== PÁGINA RESULT INICIADA ===');
    
    // FUNÇÃO PRINCIPAL - executa imediatamente
    function inicializarPagina() {
        // Obter dados do localStorage
        const dadosSalvos = localStorage.getItem('resultadoFitcard');
        
        if (!dadosSalvos) {
            console.log('❌ Nenhum dado, redirecionando...');
            window.location.href = 'index.html';
            return;
        }
        
        let dados;
        try {
            dados = JSON.parse(dadosSalvos);
            console.log('✅ Dados carregados:', dados);
        } catch (e) {
            console.error('❌ Erro nos dados:', e);
            window.location.href = 'index.html';
            return;
        }
        
        // PREENCHER DADOS IMEDIATAMENTE (não depende de carregamento externo)
        preencherDados(dados);
        
        // CONFIGURAR BOTÕES IMEDIATAMENTE
        configurarBotoes(dados);
        
        console.log('✅ Página inicializada com sucesso!');
    }

    // FUNÇÃO PARA FORMATAR NÚMEROS DECIMAIS
    function formatarNumero(numero) {
        if (numero === undefined || numero === null) return '0';
        
        // Converte para número se for string
        const num = typeof numero === 'string' ? parseFloat(numero) : numero;
        
        // Verifica se é um número válido
        if (isNaN(num)) return '0';
        
        // Verifica se tem casas decimais
        if (Number.isInteger(num)) {
            return num.toString();
        } else {
            // Formata com 1 casa decimal, remove zeros desnecessários
            return num.toFixed(1).replace(/\.0$/, '');
        }
    }

    // FUNÇÃO PARA FORMATAR TEMPO
    function formatarTempo(tempo, unidade) {
        const tempoFormatado = formatarNumero(tempo);
        
        if (unidade === 'horas' && tempo < 1) {
            // Converte horas fracionárias para minutos
            const minutos = Math.round(tempo * 60);
            return `${minutos} minutos`;
        } else {
            return `${tempoFormatado} ${unidade}`;
        }
    }

    function preencherDados(dados) {
        console.log('📊 Preenchendo dados:', dados);
        
        // Preencher dados básicos primeiro COM FORMATAÇÃO
        document.getElementById('activity-title').textContent = 
            dados.atividade.charAt(0).toUpperCase() + dados.atividade.slice(1);
        
        // TEMPO - com formatação inteligente
        document.getElementById('time-value').textContent = 
            formatarTempo(dados.tempoOriginal, dados.unidade);
        
        // DISTÂNCIA - mantém decimais
        document.getElementById('distance-value').textContent = 
            `${formatarNumero(dados.distancia)} km`;
        
        // GÊNERO
        document.getElementById('gender-value').textContent = 
            dados.genero.charAt(0).toUpperCase() + dados.genero.slice(1);
        
        // CALORIAS - sem decimais
        document.getElementById('calories-value').textContent = 
            `${dados.calorias} kcal`;
        
        // Data atual
        document.getElementById('current-date').textContent = 
            new Date().toLocaleDateString('pt-BR');
        
        // Ícone (opcional - pode carregar depois)
        setTimeout(() => {
            atualizarIcone(dados.atividade);
        }, 100);
    }

    function atualizarIcone(atividade) {
        const activityIcon = document.querySelector('.activity-icon svg');
        if (!activityIcon) return;
        
        const iconPaths = {
            caminhada: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />',
            corrida: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />',
            pedal: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />'
        };
        
        if (iconPaths[atividade]) {
            activityIcon.innerHTML = iconPaths[atividade];
        }
    }

    function configurarBotoes(dados) {
        const btnBaixar = document.getElementById('baixarImagem');
        const btnNovo = document.getElementById('novoCalculo');
        
        console.log('🔍 Botões encontrados:', {
            baixar: !!btnBaixar,
            novo: !!btnNovo
        });
        
        // BOTÃO BAIXAR - com fallback
        if (btnBaixar) {
            // Remover event listeners antigos
            btnBaixar.replaceWith(btnBaixar.cloneNode(true));
            const novoBtnBaixar = document.getElementById('baixarImagem');
            
            novoBtnBaixar.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🎯 Download iniciado...');
                
                // Feedback visual imediato
                this.textContent = '⏳ Gerando...';
                this.disabled = true;
                
                baixarCard(dados, this);
            });
        }
        
        // BOTÃO NOVO CÁLCULO - simples e direto
        if (btnNovo) {
            btnNovo.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🔄 Indo para novo cálculo...');
                window.location.href = 'index.html';
            });
        }
    }

    function baixarCard(dados, botao) {
        // Verificar se html2canvas está carregado
        if (typeof html2canvas === 'undefined') {
            console.error('❌ html2canvas não carregado');
            alert('Recurso de download ainda não carregou. Aguarde alguns segundos e tente novamente.');
            botao.textContent = '📥 Baixar imagem';
            botao.disabled = false;
            return;
        }
        
        console.log('🖼️ Iniciando captura...');
        
        html2canvas(document.getElementById('card'), {
            scale: 2,
            useCORS: true,
            backgroundColor: null
        }).then(canvas => {
            console.log('✅ Captura concluída');
            
            const link = document.createElement('a');
            link.download = `fitcard_${dados.atividade}_${dados.calorias}kcal.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Restaurar botão
            botao.textContent = '📥 Baixar imagem';
            botao.disabled = false;
            
        }).catch(error => {
            console.error('❌ Erro na captura:', error);
            alert('Erro ao gerar imagem. Tente novamente.');
            botao.textContent = '📥 Baixar imagem';
            botao.disabled = false;
        });
    }

    // INICIAR TUDO IMEDIATAMENTE
    inicializarPagina();
    
    // FALLBACK: Se algo der errado, tentar novamente após 2 segundos
    setTimeout(() => {
        const btnBaixar = document.getElementById('baixarImagem');
        const btnNovo = document.getElementById('novoCalculo');
        
        if (!btnBaixar || !btnNovo) {
            console.log('🔄 Reconfigurando botões...');
            const dados = JSON.parse(localStorage.getItem('resultadoFitcard') || '{}');
            configurarBotoes(dados);
        }
    }, 2000);
});