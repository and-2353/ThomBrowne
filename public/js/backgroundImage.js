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
    document.getElementById('image_nunokawa').src = images_nunokawa[currentIndex];
    document.getElementById('image_mitio').src = images_mitio[currentIndex];
}
