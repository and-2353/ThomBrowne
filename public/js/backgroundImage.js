// backgroundImage.js
const images_nunokawa = [
    "/assets/processed/background/nunokawa1.png",
    "/assets/processed/background/nunokawa2.png",
];

const images_mitio = [
    "/assets/processed/background/mitio1.png",
    "/assets/processed/background/mitio2.png",
];

let currentIndex = 0;

export function changeBackgroundImage() {
    currentIndex = (currentIndex + 1) % images_nunokawa.length;

    const nunokawaImage = document.getElementById('image_nunokawa');
    const mitioImage = document.getElementById('image_mitio');

    if (nunokawaImage) {
        nunokawaImage.src = images_nunokawa[currentIndex];
    } else {
        console.error('nunokawa image element not found');
    }

    if (mitioImage) {
        mitioImage.src = images_mitio[currentIndex];
    } else {
        console.error('mitio image element not found');
    }
}
