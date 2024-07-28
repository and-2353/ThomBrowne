// gameLogic.js
import { openModal, closeModal } from './modal.js';
import { loadTSV } from './loadTSV.js';
import { typewriterEffect } from './typewriterEffect.js';

let texts = [];
let map = {};
loadTSV('/data/texts.tsv', parsedData => {
    texts = parsedData.map(row => row[0]);
    map = parsedData.reduce((acc, row, index) => {
        acc[`te${index}`] = `im${row[1]}`;
        return acc;
    }, {});
});

let display_text_id = "te0"; //表示されてる text(問題文) のid
let q_num = 0; // 何問目か
let q_is_fnshed = false; // 問題終了フラグ
let hiddenelement = ""; // hidden にしている input タグ
let start_time;
let elapsed_time = 0;
let accumulated_time = 0; // 累積経過時間
let miss_num = 0;
let total_time = 0;
let next_start_time;
let intervalId;

function updateElapsedTime() {
    if (!q_is_fnshed) {
        elapsed_time = (Date.now() - start_time + accumulated_time) / 1000;
        document.getElementById('elapsed-time').textContent = elapsed_time.toFixed(2);
        // console.log(`Elapsed time updated: ${elapsed_time.toFixed(2)} seconds`);
    }
}

function startOrRestartElapsedTime() {
    start_time = Date.now(); // 現在の時刻を取得
    intervalId = setInterval(updateElapsedTime, 100);
    console.log(`Timer started/restarted at: ${start_time}`);
}

function stopElapsedTime() {
    clearInterval(intervalId);
    accumulated_time += Date.now() - start_time; // 中断までの経過時間を累積時間に追加
    // console.log(`Timer stopped at: ${Date.now()}`);
    // console.log(`Accumulated time: ${accumulated_time}`);
}

export function changeIMG() {

    if (q_num === 0) {
        start_time = Date.now();
        accumulated_time = 0; // 累積時間をリセット
        startOrRestartElapsedTime();
    } else {
        total_time += Date.now() - next_start_time;
    }

    // テキストが混ざるのを防ぐためにinnerHTMLを空に設定
    const titleElement = document.getElementById('title');
    if (titleElement) {
        titleElement.innerHTML = '';
    }

    // nextボタンを隠す, hidden にしている input タグを再表示する
    document.getElementById('next').style.visibility = 'hidden';
    document.getElementById(hiddenelement).style.visibility = 'visible';

    // シャッフルされたリストを作る
    const arrs = [];
    for (let i = 0; i < 22; i++) { // i < [画像数]
        arrs.push(i);
    }
    let a = arrs.length;
    while (a) {
        const j = Math.floor(Math.random() * a);
        const t = arrs[--a];
        arrs[a] = arrs[j];
        arrs[j] = t;
    }

    // テキストの書き換え
    const slcted = Math.floor(Math.random() * arrs.length);
    if (!texts[arrs[slcted]]) {
        return;
    }
    if (titleElement) {
        typewriterEffect(texts[arrs[slcted]]);
    }
    display_text_id = "te" + String(arrs[slcted]);

    // 問題終了フラグ・問題数の切り替え
    q_is_fnshed = false;
    q_num++;

    // 正解画像を表示するdivを決める
    const slcted_div = Math.floor(Math.random() * 4);

    // 画像の置き換え
    for (let i = 0; i < 4; i++) {
        if (i === slcted_div) {
            const id_im = "im-p-" + String(i);
            const dec = map[display_text_id]?.match(/\d+/);
            if (!dec) {
                document.getElementById(id_im).src = `/assets/processed/karuta/imnull.png`;
            } else {
                document.getElementById(id_im).src = `/assets/processed/karuta/im${dec}.png`;
            }

            const index = arrs.indexOf(parseInt(dec));
            arrs.splice(index, 1);
            if (dec == 4) {
                const i_ = arrs.indexOf(10);
                arrs.splice(i_, 1);
            }
            if (dec == 10) {
                const i__ = arrs.indexOf(4);
                arrs.splice(i__, 1);
            }
        } else {
            const j = arrs[i];
            const id_im = "im-p-" + String(i);
            document.getElementById(id_im).src = `/assets/processed/karuta/im${j}.png`;
        }
    }
    next_start_time = Date.now();
    startOrRestartElapsedTime();
}

export function Judge(element) {
    if (q_is_fnshed) {
        return;
    }
    stopElapsedTime();
    if (q_num === 4) {
        total_time += Date.now() - next_start_time;
        elapsed_time = total_time;
        console.log("bs", (accumulated_time/1000).toFixed(2));
    }

    const attr = element.getAttribute("src"); // input要素のsrc属性の値を取得
    const this_id = element.getAttribute("ID");
    hiddenelement = this_id;
    document.getElementById(this_id).style.visibility = 'hidden';
    const result = attr.match(/\d+/); // パスに含まれる数字の1文字以上の繰り返しを抽出

    // 判定
    const resp = `im${result}`;
    const answ = map[display_text_id].trim();
    const id_result = `result-${q_num}`;

    if (resp === answ) {
        document.getElementById(id_result).innerHTML = '<img src="/assets/processed/evaluation/yatta.png">';
    } else {
        document.getElementById(id_result).innerHTML = '<img src="/assets/processed/evaluation/dame.png">';
        miss_num++;
    }

    q_is_fnshed = true; // 問題終了フラグの切り替え
    document.getElementById('next').style.visibility = 'visible'; //nextボタン表示
    if (q_num >= 4) {
        document.getElementById('next-or-result').innerHTML = '<a href="javascript:void(0)" class="btn btn-malformation" id="result">リザルト</a>';
        document.getElementById('result').onclick = DisplayResult;
    }
}

export function DisplayResult() {
    openModal('modal-content-result'); // モーダルを表示
    stopElapsedTime(); // リザルト表示でタイマーを完全停止

    const result_time = parseFloat(document.getElementById('elapsed-time').textContent);
    const penalty_time = miss_num * 5;
    const final_time = result_time + penalty_time;

    document.getElementById('clear-time').innerHTML = ` ${result_time}`;
    document.getElementById('penalty-time').innerHTML = `${penalty_time}`;
    document.getElementById('penalty-num').innerHTML = `${miss_num}`;
    document.getElementById('final-score').innerHTML = `${final_time}`;

    let shareUrl = 'https://twitter.com/intent/tweet';
    shareUrl += '?text=' + encodeURIComponent(`Score: ${final_time.toFixed(2)}秒\nplayed トム・ブラウンかるた\n`);
    shareUrl += '&url=' + encodeURIComponent('https://and-2353.github.io/ThomBrowne/');

    const shareLink = `<a href="${shareUrl}" target="_blank" class="share-button">Share on X</a>`;
    document.getElementById('share').innerHTML = `<h1>${shareLink}</h1>`;
    
    document.getElementById('next-or-result').innerHTML = '<a href="javascript:void(0)" class="btn btn-malformation" id="restart" onclick="reload()">はじめから</a>';
}

export function DisplayRule() {
    openModal('modal-content-rule'); // ルールダイアログ表示
}

export function reload() {
    location.reload();
}
