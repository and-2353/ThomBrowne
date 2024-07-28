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

    const nextButton = document.getElementById('next');
    if (nextButton) {
        nextButton.addEventListener('click', changeIMG);
    } else {
        console.error('next button not found');
    }

    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMenu);
    } else {
        console.error('hamburger menu not found');
    }

    const restartButton = document.getElementById('restart');
    if (restartButton) {
        restartButton.addEventListener('click', reload);
    } else {
        console.error('restart button not found');
    }

    const modalOpenRuleButton = document.getElementById('modal-open-rule');
    if (modalOpenRuleButton) {
        modalOpenRuleButton.addEventListener('click', DisplayRule);
    } else {
        console.error('modal-open-rule button not found');
    }

    const restartRuleButton = document.getElementById('restart-rule');
    if (restartRuleButton) {
        restartRuleButton.addEventListener('click', reload);
    } else {
        console.error('restart-rule button not found');
    }

    const closeRuleButton = document.getElementById('close-rule');
    if (closeRuleButton) {
        closeRuleButton.addEventListener('click', () => closeModal('modal-content-rule'));
    } else {
        console.error('close-rule button not found');
    }

    const restartResultButton = document.getElementById('restart-result');
    if (restartResultButton) {
        restartResultButton.addEventListener('click', reload);
    } else {
        console.error('restart-result button not found');
    }

    const closeResultButton = document.getElementById('close-result');
    if (closeResultButton) {
        closeResultButton.addEventListener('click', () => closeModal('modal-content-result'));
    } else {
        console.error('close-result button not found');
    }

    // リザルトボタンのイベントリスナーを設定
    document.getElementById('next-or-result').addEventListener('click', (event) => {
        if (event.target && event.target.id === 'result') {
            DisplayResult();
        }
    });

    // 画像が正常に切り替わるか確認するためのログ
    setInterval(() => {
        changeBackgroundImage();
    }, 1000); // 1秒ごとに変更
});
