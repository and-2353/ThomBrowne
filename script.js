//画像パスの配列を作成
var paths = []; 
for (let i=0; i<22; i++) { // i < [画像数]
    paths.push("./materials/processed/karuta/im" + i + ".png");
}

var texts = [
    "ケンタッキーは…", "はまぐりは…", "スマートフォンは…" , "夢屋まさるは…", 
    "誰か一緒に…", "ミドリムシは…", "お尻で温めて…", "そうめんは…",
    "醤油に醤油をかけて…","豚骨スープで…", "誰か一緒に…", "偉い人を…",
    "かまいたちの濱家を…", "春雨は…", "ジャックライアンのDVDを…", "皆さんと私は…",
    "生卵は…", "また僕と皆さんで…", "どん兵衛は…", "皆さん…",
    "マイメロディに…", "広瀬すずちゃんと…", "お尻で…", "頑張っている人を…",
    "牛肉を…"
];
var display_text_id = "te0"; //表示されてる text(問題文) のid

var map = {
    "te0":"im0", "te1":"im1", "te2":"im2", "te3":"im3",
    "te4":"im4", "te5":"im5", "te6":"im6", "te7":"im7",
    "te8":"im8", "te9":"im9", "te10":"im3", "te11":"im11",
    "te12":"im3", "te13":"im5", "te14":"im12", "te15":"im13",
    "te16":"im14", "te17":"im15", "te18":"im7", "te19":"im16",
    "te20":"im17", "te21":"im18", "te22":"im19", "te23":"im20",
    "te24":"im21"
};
var q_num = 0; // 何問目か
var q_is_fnshed = false; // 問題終了フラグ
var hiddenelement = ""; // hidden にしている input タグ



// 画像切り替え関数
function changeIMG(){

    // nextボタンを隠す, hidden にしている input タグを再表示する
    document.getElementById('next').style.visibility = 'hidden';
    document.getElementById(hiddenelement).style.visibility = 'visible';
    
    // シャッフルされたリストを作る
    var arrs = [];
    for (let i=0; i<22; i++) { // i< [画像数]
        arrs.push(i);
    }
    var a = arrs.length;
    while (a) {
        var j = Math.floor( Math.random() * a );
        var t = arrs[--a];
        arrs[a] = arrs[j];
        arrs[j] = t;
    }

    // テキストの書き換え
    var slcted = Math.floor( Math.random() * arrs.length);
    document.getElementById('title').innerHTML = texts[arrs[slcted]];
    display_text_id = "te" + String(arrs[slcted]);
    
    // 問題終了フラグ・問題数の切り替え
    q_is_fnshed= false; 
    q_num++;

    // 正解画像を表示するdivを決める
    var slcted_div = Math.floor( Math.random() * 4);

    // 画像の置き換え
    for (let i=0; i<4; i++) {

        // selected_div に正解画像を表示
        if (i == slcted_div){
            var id_im = "im-p-" + String(i);
            var dec = map[display_text_id].match(/\d+/);

            // 重複削除
            var index = arrs.indexOf(dec);
            arrs.splice(index, 1)

            document.getElementById(id_im).src = paths[dec];  
        }
        else{
            var j = arrs[i];
            var id_im = "im-p-" + String(i);
            document.getElementById(id_im).src = paths[j];  
        } 
    }
}

function Judge(element){
    if (q_is_fnshed){
        return;
    }
    
    var attr = element.getAttribute("src"); // input要素のsrc属性の値を取得
    var this_id = element.getAttribute("ID");
    hiddenelement = this_id
    document.getElementById(this_id).style.visibility = 'hidden';
    var result = attr.match(/\d+/); // パスに含まれる数字の1文字以上の繰り返しを抽出
    
    // 判定
    var resp = "im" + result;
    var answ = map[display_text_id];
    id_result = "result-" + String(q_num);
    if (resp == answ) {
        document.getElementById(id_result).innerHTML = '<img src="./materials/processed/evaluation/yatta.png">';
    }else{
        document.getElementById(id_result).innerHTML = '<img src="./materials/processed/evaluation/dame.png">';
    }

    q_is_fnshed = true; // 問題終了フラグの切り替え
    document.getElementById('next').style.visibility = 'visible'; //nextボタン表示
    if (q_num >= 4){
        document.getElementById('next-or-result').innerHTML = '<button id="result" onclick="result()">RESULT</button>';
        //document.getElementById('next').style.visibility = 'visible'; //nextボタン表示
        
    }
}

     