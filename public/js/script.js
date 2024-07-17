// document.addEventListener('DOMContentLoaded', () => {
//     // モーダルを開く関数
//     function openModal(modalId) {
//         document.getElementById(modalId).style.display = 'block';
//         document.getElementById('modal-overlay').style.display = 'block';
//     }

//     // モーダルを閉じる関数
//     function closeModal(modalId) {
//         document.getElementById(modalId).style.display = 'none';
//         document.getElementById('modal-overlay').style.display = 'none';
//     }

//     // ハンバーガーメニューの開閉関数
//     function toggleMenu() {
//         const navList = document.querySelector('.nav-list');
//         navList.classList.toggle('active');
//     }

//     // TSVファイルを読み込む関数
//     function loadTSV(path, callback) {
//         fetch(path)
//             .then(response => response.text())
//             .then(data => {
//                 const parsedData = data.split('\n').map(row => row.split('\t'));
//                 callback(parsedData);
//             });
//     }

//     let texts = [];
//     let map = {};
//     loadTSV('/data/texts.tsv', parsedData => {
//         texts = parsedData.map(row => row[0]);
//         map = parsedData.reduce((acc, row, index) => {
//             acc[`te${index}`] = `im${row[1]}`;
//             return acc;
//         }, {});
//     });

//     let display_text_id = "te0"; //表示されてる text(問題文) のid
//     let q_num = 0; // 何問目か
//     let q_is_fnshed = false; // 問題終了フラグ
//     let hiddenelement = ""; // hidden にしている input タグ
//     let start_time;
//     let collapsed_time;
//     let miss_num = 0;
//     let total_time = 0;
//     let next_start_time;

//     // 画像切り替え関数
//     function changeIMG() {
//         if (q_num === 0) {
//             start_time = Date.now();
//         } else {
//             total_time += Date.now() - next_start_time;
//         }

//         // nextボタンを隠す, hidden にしている input タグを再表示する
//         document.getElementById('next').style.visibility = 'hidden';
//         document.getElementById(hiddenelement).style.visibility = 'visible';
        
//         // シャッフルされたリストを作る
//         const arrs = [];
//         for (let i = 0; i < 22; i++) { // i < [画像数]
//             arrs.push(i);
//         }
//         let a = arrs.length;
//         while (a) {
//             const j = Math.floor(Math.random() * a);
//             const t = arrs[--a];
//             arrs[a] = arrs[j];
//             arrs[j] = t;
//         }

//         // テキストの書き換え
//         const slcted = Math.floor(Math.random() * arrs.length);
//         typewriterEffect(texts[arrs[slcted]]);
//         display_text_id = "te" + String(arrs[slcted]);
        
//         // 問題終了フラグ・問題数の切り替え
//         q_is_fnshed = false; 
//         q_num++;

//         // 正解画像を表示するdivを決める
//         const slcted_div = Math.floor(Math.random() * 4);

//         // 画像の置き換え
//         for (let i = 0; i < 4; i++) {
//             // selected_div に正解画像を表示
//             if (i === slcted_div) {
//                 const id_im = "im-p-" + String(i);
//                 const dec = map[display_text_id].match(/\d+/);
//                 document.getElementById(id_im).src = `/assets/processed/karuta/im${dec}.png`;

//                 // 重複削除
//                 const index = arrs.indexOf(dec);
//                 arrs.splice(index, 1);
//                 if (dec == 4) {
//                     const i_ = arrs.indexOf(10);
//                     arrs.splice(i_, 1);
//                 }
//                 if (dec == 10) {
//                     const i__ = arrs.indexOf(4);
//                     arrs.splice(i__, 1);
//                 }
//             } else {
//                 const j = arrs[i];
//                 const id_im = "im-p-" + String(i);
//                 document.getElementById(id_im).src = `/assets/processed/karuta/im${j}.png`;
//             }
//         }
//         next_start_time = Date.now();
//     }

//     function Judge(element) {
//         if (q_is_fnshed) {
//             return;
//         }
//         if (q_num === 4) {
//             total_time += Date.now() - next_start_time;
//             collapsed_time = total_time;
//         }

//         const attr = element.getAttribute("src"); // input要素のsrc属性の値を取得
//         const this_id = element.getAttribute("ID");
//         hiddenelement = this_id;
//         document.getElementById(this_id).style.visibility = 'hidden';
//         const result = attr.match(/\d+/); // パスに含まれる数字の1文字以上の繰り返しを抽出

//         // 判定
//         const resp = `im${result}`;
//         const answ = map[display_text_id];
//         const id_result = `result-${q_num}`;
//         if (resp === answ) {
//             document.getElementById(id_result).innerHTML = '<img src="/assets/processed/evaluation/yatta.png">';
//         } else {
//             document.getElementById(id_result).innerHTML = '<img src="/assets/processed/evaluation/dame.png">';
//             miss_num++;
//         }

//         q_is_fnshed = true; // 問題終了フラグの切り替え
//         document.getElementById('next').style.visibility = 'visible'; //nextボタン表示
//         if (q_num >= 4) {
//             document.getElementById('next-or-result').innerHTML = '<a href="javascript:void(0)" class="btn btn-malformation" id="result" onclick="DisplayResult()">リザルト</a>';
//         }
//     }

//     function DisplayResult() {
//         openModal('modal-content-result'); // モーダルを表示
//         document.getElementById('title').innerHTML = "リザルト"; // タイトル変更
//         const result_time = collapsed_time / 1000;
//         const penalty_time = miss_num * 5;
//         const final_time = result_time + penalty_time;

//         document.getElementById('clear-time').innerHTML = `クリアタイム: ${result_time.toFixed(2)}秒`;
//         document.getElementById('penalty').innerHTML = `ペナルティ: ${miss_num}回 x 5秒`;
//         document.getElementById('final-score').innerHTML = `最終スコア: ${final_time.toFixed(2)}秒`;
        
//         let shareUrl = 'https://twitter.com/intent/tweet';
//         shareUrl += '?text=' + encodeURIComponent(`Score: ${final_time.toFixed(2)}秒\nplayed トム・ブラウンかるた\n`);
//         shareUrl += '&url=' + encodeURIComponent('https://and-2353.github.io/ThomBrowne/');

//         // シェアボタン追加
//         const shareLink = `<a href="${shareUrl}" target="_blank"><img src="path/to/twitter_icon.png" alt="Share on Twitter" width="32" height="32"></a>`;
//         document.getElementById('share').innerHTML = `<h1>シェア：${shareLink}</h1>`;
//         document.getElementById('next-or-result').innerHTML = '<a href="javascript:void(0)" class="btn btn-malformation" id="restart" onclick="reload()">はじめから</a>';
//     }

//     function DisplayRule() {
//         openModal('modal-content-rule'); // ルールダイアログ表示
//     }

//     function reload() {
//         location.reload();
//     }

//     // 画像切り替えの追加コード

//     const images_nunokawa = [
//         "/assets/processed/background/nunokawa1.png",
//         "/assets/processed/background/nunokawa2.png",
//     ];

//     const images_mitio = [
//         "/assets/processed/background/mitio1.png",
//         "/assets/processed/background/mitio2.png",
//     ];

//     let currentIndex = 0;

//     function changeBackgroundImage() {
//         currentIndex = (currentIndex + 1) % images_nunokawa.length;
//         document.getElementById('image_nunokawa').src = images_nunokawa[currentIndex];
//         document.getElementById('image_mitio').src = images_mitio[currentIndex];
//     }

//     setInterval(changeBackgroundImage, 1000);

//     function typewriterEffect(text) {
//         const animatedText = document.getElementById('animated-text');
//         animatedText.textContent = '';
//         let i = 0;
//         const interval = setInterval(() => {
//             if (i < text.length) {
//                 animatedText.textContent += text[i];
//                 i++;
//             } else {
//                 clearInterval(interval);
//             }
//         }, 100);
//     }

//     // イベントリスナーを設定
//     document.querySelectorAll('.mid-item input').forEach(item => {
//         item.addEventListener('click', function () {
//             Judge(this);
//         });
//     });

//     document.getElementById('next').addEventListener('click', changeIMG);
// });
