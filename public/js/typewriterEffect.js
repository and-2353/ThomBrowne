// // typewriterEffect.js
// export function typewriterEffect(text) {
//     if (!text) {
//         console.error('typewriterEffect received undefined text.');
//         return;
//     }

//     const animatedText = document.getElementById('animated-text');
//     animatedText.textContent = '';
//     let i = 0;
//     const interval = setInterval(() => {
//         if (i < text.length) {
//             animatedText.textContent += text.charAt(i);
//             i++;
//         } else {
//             clearInterval(interval);
//         }
//     }, 100);
// }

// typewriterEffect.js
export function typewriterEffect(text) {
    const titleElement = document.getElementById('title');
    if (!titleElement) return; // titleElementが存在しない場合は何もしない

    let i = 0;
    const speed = 50; // 文字を表示する速度 (ミリ秒)

    function type() {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

