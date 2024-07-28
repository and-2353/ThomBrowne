
export function loadTSV(path, callback) {
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const parsedData = data.split('\n').map(row => row.split('\t'));
            callback(parsedData);
        })
        .catch(error => console.error('Error loading TSV file:', error));
}
