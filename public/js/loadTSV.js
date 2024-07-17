
export function loadTSV(path, callback) {
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('TSV data:', data); // TSVファイルの内容を表示
            const parsedData = data.split('\n').map(row => row.split('\t'));
            console.log('Parsed TSV data:', parsedData); // パースした後のデータを表示
            callback(parsedData);
        })
        .catch(error => console.error('Error loading TSV file:', error));
}
