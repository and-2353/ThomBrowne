
var paths = []; //画像パスの配列

for (let i=0; i<4; i++) {
    paths.push("./materials/processed/karuta/im" + i + ".png");
}

var texts = ["ケンタッキーは…", "はまぐりは…", "スマートフォンは…" , "夢屋まさるは…"];
var display_text_id = "te0";

var map = {"te0":"im0", "te1":"im1", "te2":"im2", "te3":"im3"};
var q_num = 0;
var q_is_fnshed = false;



// 画像切り替え関数
function changeIMG(){
    
    var arrs = []; // 順番決め用整数配列

    for (let i=0; i<4; i++) {
        arrs.push(i);
    }
    var a = arrs.length;
    
    // シャッフル
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
    
    alert(q_is_fnshed);
    q_is_fnshed= false;
    q_num++;

    // 画像の置き換え
    for (let i=0; i<4; i++) {
        var j = arrs[i];
        var id_im = "im-p-" + String(i);
        document.getElementById(id_im).src = paths[j];  
    }
    
    
}

function Judge(element){
    if (q_is_fnshed){
        return;
    }
    var attr = element.getAttribute("src"); // input要素のsrc属性の値を取得
    element.remove();
    var result = attr.match(/\d+/); // パスに含まれる数字の1文字以上の繰り返しを抽出
    
    
    var resp = "im" + result;
    var answ = map[display_text_id];

    id_result = "result-" + String(q_num);
    
    if (resp == answ) {
        document.getElementById(id_result).innerHTML = '<img src="./materials/processed/evaluation/yatta.png">';
    }else{
        document.getElementById(id_result).innerHTML = '<img src="./materials/processed/evaluation/dame.png">';
    }

    q_is_fnshed = true;
    
    
}

     