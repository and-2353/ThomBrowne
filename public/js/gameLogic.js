// gameLogic.js
import { openModal, closeModal } from './modal.js';
import { loadTSV } from './loadTSV.js';
import { typewriterEffect } from './typewriterEffect.js';

let texts = [];
let map = {};
loadTSV('/data/texts.tsv', parsedData => {
    console.log('Loaded TSV data:', parsedData); // 読み込んだデータを表示
    texts = parsedData.map(row => row[0]);
    map = parsedData.reduce((acc, row, index) => {
        acc[`te${index}`] = `im${row[1]}`;
        return acc;
    }, {});
    console.log('Texts:', texts); // texts配列を表示
    console.log('Map:', map); // mapオブジェクトを表示
});

console.log(texts);
let display_text_id = "te0"; //表示されてる text(問題文) のid
let q_num = 0; // 何問目か
let q_is_fnshed = false; // 問題終了フラグ
let hiddenelement = ""; // hidden にしている input タグ
let start_time;
let collapsed_time;
let miss_num = 0;
let total_time = 0;
let next_start_time;

export function changeIMG() {
    if (q_num === 0) {
        start_time = Date.now();
    } else {
        total_time += Date.now() - next_start_time;
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
        console.log('テキストが存在しません。');
        return;
    }
    typewriterEffect(texts[arrs[slcted]]);
    display_text_id = "te" + String(arrs[slcted]);

    console.log('Display text ID:', display_text_id);
    console.log('Map for display text ID:', map[display_text_id]);

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
                console.log('Dec value is null:', dec);
                document.getElementById(id_im).src = `/assets/processed/karuta/imnull.png`;
            } else {
                console.log('Dec value:', dec);
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
}

export function Judge(element) {
    if (q_is_fnshed) {
        return;
    }
    if (q_num === 4) {
        total_time += Date.now() - next_start_time;
        collapsed_time = total_time;
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
    }
}


export function DisplayResult() {
    openModal('modal-content-result'); // モーダルを表示
    //document.getElementById('title').innerHTML = "リザルト"; // タイトル変更
    const result_time = collapsed_time / 1000;
    const penalty_time = miss_num * 5;
    const final_time = result_time + penalty_time;

    document.getElementById('clear-time').innerHTML = ` ${result_time.toFixed(2)}`;
    document.getElementById('penalty-time').innerHTML = `${penalty_time}`;
    document.getElementById('penalty-num').innerHTML = `${miss_num}`;
    document.getElementById('final-score').innerHTML = `${final_time.toFixed(2)}`;

    let shareUrl = 'https://twitter.com/intent/tweet';
    shareUrl += '?text=' + encodeURIComponent(`Score: ${final_time.toFixed(2)}秒\nplayed トム・ブラウンかるた\n`);
    shareUrl += '&url=' + encodeURIComponent('https://and-2353.github.io/ThomBrowne/');

    // シェアボタン追加
    // const shareLink = `<a href="${shareUrl}" target="_blank"><img src="/assets/processed/icon/logo-black.png" alt="Share on X" width="32" height="32"></a>`;
    const shareLink = `<button class="share-button">Share on X</button>`;
    document.getElementById('share').innerHTML = `<h1>${shareLink}</h1>`;
    
    document.getElementById('next-or-result').innerHTML = '<a href="javascript:void(0)" class="btn btn-malformation" id="restart" onclick="reload()">はじめから</a>';
}

export function DisplayRule() {
    openModal('modal-content-rule'); // ルールダイアログ表示
}

export function reload() {
    location.reload();
}
