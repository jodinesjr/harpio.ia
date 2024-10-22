chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'audioData') {
      let blob = new Blob(request.data, { type: 'audio/wav' });
      let url = URL.createObjectURL(blob);
      window.open(url, '_blank'); // Abra em uma nova aba (Exemplo!)
      // Use `postMessage` para enviar o URL do áudio para o seu aplicativo
    }
  });