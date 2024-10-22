function handleCredentialResponse(response) {
    const user = jwt_decode(response.credential);
    document.getElementById('userInfo').innerHTML = `
        <img src="${user.picture}" alt="Avatar" class="rounded-circle" width="40" height="40">
        <span class="ml-2">${user.name}</span>`;
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('appContent').style.display = 'block';
    document.getElementById('googleLogin').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'inline-block';
}

function handleSignOut() {
    // Atualiza a página
        window.location.reload();
    };

window.onload = function () {
    google.accounts.id.initialize({
        client_id: '353192059977-svjv8ol3u13d4d6tprs06nhn0ld1mat2.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('googleLogin'),
        { theme: '', size: '' }
    );
};

// Simplificando a lógica de login/logout:
document.getElementById('googleLogin').addEventListener('click', () => {
    google.accounts.id.prompt();
});

document.getElementById('logoutButton').addEventListener('click', () => {
        window.location.reload();
    });
