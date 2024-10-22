async function transcreverAudio(audioBlob) {
    // Exibe o spinner de carregamento da transcrição
    transcriptionSpinner.style.display = 'inline-block';
    transcriptionSpinnerText.style.display = 'inline-block';

    const apiKey = "8048696e8c1640ca902f726e2134daab"; // Sua chave da API AssemblyAI

    try {
        // Primeiro, faça o upload do áudio para AssemblyAI
        const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
            method: 'POST',
            headers: {
                'authorization': apiKey,
            },
            body: audioBlob
        });

        const uploadData = await uploadResponse.json();
        const audioUrl = uploadData.upload_url; // URL do áudio carregado

        // Agora, inicie o processo de transcrição
        const transcriptionResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: {
                'authorization': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                audio_url: audioUrl, // URL do áudio carregado
                speech_model: "nano",
                language_detection: true,
                // speech_model: "best",
                // diarization: true // Habilita a diarização se necessário
            })
        });

        const transcriptionData = await transcriptionResponse.json();
        const transcriptId = transcriptionData.id;

        // Verifique o status da transcrição até que esteja completa
        let isTranscriptionComplete = false;
        while (!isTranscriptionComplete) {
            const resultResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: {
                    'authorization': apiKey,
                }
            });

            const resultData = await resultResponse.json();
            if (resultData.status === 'completed') {
                transcriptionText.textContent = resultData.text; // Exibe a transcrição
                transcriptionText.style.display = 'block';
                isTranscriptionComplete = true;
            } else if (resultData.status === 'failed') {
                transcriptionText.textContent = 'Transcrição falhou.';
                transcriptionText.style.display = 'block';
                isTranscriptionComplete = true;
            } else {
                // Aguarde um segundo antes de verificar o status novamente
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } catch (error) {
        console.error('Erro na transcrição:', error);
        transcriptionText.textContent = 'Erro ao processar a transcrição.';
        transcriptionText.style.display = 'block';
    } finally {
        // Esconde o spinner após a transcrição
        transcriptionSpinner.style.display = 'none';
        transcriptionSpinnerText.style.display = 'none';
    }
}