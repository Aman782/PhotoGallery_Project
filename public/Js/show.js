document.addEventListener('DOMContentLoaded', () => {
    const downloadButtons = document.querySelectorAll('.download-btn');

    downloadButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const url = event.target.getAttribute('data-url');
            downloadFile(url);
        });
    });
});

function downloadFile(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop(); // This will set the filename to the original filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
