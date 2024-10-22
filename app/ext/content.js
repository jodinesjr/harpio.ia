navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const recorder = new MediaRecorder(stream);
    let audioChunks = [];

    recorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      chrome.runtime.sendMessage({ type: 'audioData', data: audioChunks });
    };

    recorder.start();

    // Crie um botão para parar a gravação
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Parar Gravação';
    stopButton.addEventListener('click', () => {
      recorder.stop();
    });

    // Adicione o botão ao DOM
    document.body.appendChild(stopButton);
  })
  .catch(err => {
    console.error('Erro ao capturar áudio do microfone:', err);
  });