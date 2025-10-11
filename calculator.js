const parseNumber = str => parseFloat(str.replace(',', '.'));

document.addEventListener('DOMContentLoaded', () => {
    let tempoEmMinutos = true;
    const btnMinutos = document.getElementById('btnMinutos');
    const btnHoras = document.getElementById('btnHoras');

    const marcarBotao = () => {
        if (tempoEmMinutos) {
            btnMinutos.classList.add('active');
            btnHoras.classList.remove('active');
        } else {
            btnHoras.classList.add('active');
            btnMinutos.classList.remove('active');
        }
    };

    marcarBotao();

    btnMinutos.addEventListener('click', () => { 
        tempoEmMinutos = true; 
        marcarBotao(); 
    });
    
    btnHoras.addEventListener('click', () => { 
        tempoEmMinutos = false; 
        marcarBotao(); 
    });

    const fitForm = document.getElementById('fitForm');
    fitForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const atividade = document.getElementById('atividade').value;
        const tempoInput = document.getElementById('tempo').value;
        const distanciaInput = document.getElementById('distancia').value;
        const pesoInput = document.getElementById('peso').value;
        const idadeInput = document.getElementById('idade').value;
        const genero = document.getElementById('genero').value;

        if (!tempoInput || !distanciaInput || !pesoInput || !idadeInput) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const tempo = parseNumber(tempoInput);
        const distancia = parseNumber(distanciaInput); // km
        const peso = parseNumber(pesoInput);
        const idade = parseInt(idadeInput);

        if ([tempo, distancia, peso, idade].some(x => isNaN(x) || x <= 0)) {
            alert("Por favor, preencha todos os campos com valores positivos.");
            return;
        }

        const tempoFinal = tempoEmMinutos ? tempo : tempo * 60; // min

        // Velocidade média (m/min)
        const velocidade = (distancia * 1000) / tempoFinal; 

        // MET base para cada atividade
        const metBase = {
            caminhada: 3.5,
            corrida: 7.0,
            pedal: 6.0
        };

        // Ajuste do MET com base na velocidade (quanto mais rápido, maior MET)
        let met = metBase[atividade];

        if (atividade === 'caminhada') {
            if (velocidade > 80) met = 4.3;      // caminhada rápida
            else if (velocidade > 60) met = 3.8; // caminhada moderada
        } else if (atividade === 'corrida') {
            if (velocidade > 200) met = 12;      // corrida intensa
            else if (velocidade > 150) met = 9.8; // corrida moderada
        } else if (atividade === 'pedal') {
            if (velocidade > 300) met = 10;      // pedal rápido
            else if (velocidade > 200) met = 8;  // pedal moderado
        }

        // Cálculo de calorias com MET ajustado
        const calorias = ((met * 3.5 * peso) / 200) * tempoFinal;

        const resultado = {
            atividade,
            tempo: tempoFinal,
            tempoOriginal: tempo,
            unidade: tempoEmMinutos ? "minutos" : "horas",
            distancia: parseFloat(distancia.toFixed(1)),
            peso, 
            idade, 
            genero,
            velocidade: parseFloat(velocidade.toFixed(1)),
            met,
            calorias: Math.round(calorias)
        };

        localStorage.setItem('resultadoFitcard', JSON.stringify(resultado));
        window.location.href = 'result.html';
    });

    document.getElementById('tempo').focus();
});
