startRecording.addEventListener('click', async () => {
    audioChunks = []; // Limpa os chunks para nova gravação

    try {
        // Tenta capturar áudio da guia e do microfone
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true, // Adiciona cancelamento de eco
                noiseSuppression: true, // Adiciona supressão de ruído
                autoGainControl: true // Adiciona controle automático de ganho
            }
        });

        // Cria o MediaRecorder
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        recorder.start();

        // Exibe radar e "REC" piscando
        radarContainer.style.display = 'inline';
        document.title = 'Gravando...';

        startRecording.disabled = true;
        stopRecording.disabled = false;
    } catch (err) {
        console.error('Erro ao capturar mídia da aba e microfone:', err);

        // Caso a captura da aba e microfone falhe, captura apenas o microfone
        try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            recorder = new MediaRecorder(micStream);
            recorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            recorder.start();

            // Exibe radar e "REC" piscando
            radarContainer.style.display = 'inline';
            document.title = 'Gravando...';

            startRecording.disabled = true;
            stopRecording.disabled = false;
        } catch (micError) {
            console.error('Erro ao capturar áudio do microfone:', micError);
        }
    }
});

stopRecording.addEventListener('click', () => {
    recorder.stop();
    recorder.onstop = () => {
        recordedAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioRecorder.src = URL.createObjectURL(recordedAudioBlob); // Exibe áudio no player

        // Exibe link de download
        downloadLink.href = URL.createObjectURL(recordedAudioBlob);
        downloadLink.style.display = 'inline';

        // Esconde radar e "REC"
        radarContainer.style.display = 'none';
        document.title = 'Gravação e Google Meet';

        // Exibe mensagem toast
        showToast();

        // Inicia a transcrição com AssemblyAI
        transcreverAudio(recordedAudioBlob);
    };

    startRecording.disabled = false;
    stopRecording.disabled = true;
});