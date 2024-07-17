// main.js
import { openModal, closeModal } from './modal.js';
import { toggleMenu } from './menu.js';
import { changeIMG, Judge, DisplayResult, DisplayRule, reload } from './gameLogic.js';
import { changeBackgroundImage } from './backgroundImage.js';

document.addEventListener('DOMContentLoaded', () => {
    // イベントリスナーを設定
    document.querySelectorAll('.mid-item input').forEach(item => {
        item.addEventListener('click', function () {
            Judge(this);
        });
    });

    document.getElementById('next').addEventListener('click', changeIMG);
    document.querySelector('.hamburger-menu').addEventListener('click', toggleMenu);
    document.getElementById('restart').addEventListener('click', reload);
    document.getElementById('modal-open-rule').addEventListener('click', DisplayRule);
    document.getElementById('restart-rule').addEventListener('click', reload);
    document.getElementById('close-rule').addEventListener('click', () => closeModal('modal-content-rule'));
    document.getElementById('restart-result').addEventListener('click', reload);
    document.getElementById('close-result').addEventListener('click', () => closeModal('modal-content-result'));
    document.getElementById('result').addEventListener('click', DisplayResult);

    setInterval(changeBackgroundImage, 1000);
});
