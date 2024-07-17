// typewriterEffect.js
export function typewriterEffect(text) {
    if (!text) {
        console.error('typewriterEffect received undefined text.');
        return;
    }

    const animatedText = document.getElementById('animated-text');
    animatedText.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            animatedText.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 100);
}
