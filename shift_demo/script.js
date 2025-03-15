// script.js

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const ROWS = 8; // 最大6行（日付の行数）
const COLS = 7; // 1週間7日（列数）

const canvas = document.getElementById('calendarCanvas');
const ctx = canvas.getContext('2d');

// 選択された日付のリスト
let selectedDays = [];

// 現在の月と年を取得する
function getCurrentMonth() {
    const today = new Date();
    return {
        month: today.getMonth(), // 0-11
        year: today.getFullYear(),
    };
}

// 日本語の月名を取得する
function getMonthName(monthIndex) {
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    return monthNames[monthIndex];
}

// カレンダーの日付を描画する
function drawCalendar() {
    const { month, year } = getCurrentMonth();

    // カレンダーのサイズを設定
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 1日の曜日を取得

    const dayWidth = CANVAS_WIDTH / COLS;
    const dayHeight = CANVAS_HEIGHT / ROWS;

    // 日付を描画
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // 画面をクリア

    // 月を表示（ヘッダー）
    const monthName = getMonthName(month);
    ctx.font = "24px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#333"; // 月名の文字色を少し暗く
    ctx.fillText(`${year}年 ${monthName}`, CANVAS_WIDTH / 2, 40); // 月名と年を中央に表示

    // 曜日の描画（ヘッダー）
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    ctx.font = "18px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#333"; // 曜日の文字色

    for (let i = 0; i < COLS; i++) {
        ctx.fillText(weekdays[i], i * dayWidth + dayWidth / 2, 90); // 曜日をカレンダーの下部に表示
    }

    // 日付を描画
    let day = 1;
    for (let row = 1; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (row === 1 && col < firstDayOfWeek) continue; // 月初の空白日
            if (day > daysInMonth) break; // 日付が月の最終日を超えた場合

            const x = col * dayWidth;
            const y = row * dayHeight;

            // 背景色を水色に変更（選択されている場合のみ）
            if (selectedDays.includes(day)) {
                ctx.fillStyle = "rgba(173, 216, 230, 0.8)"; // 水色で塗りつぶし、少し透過
                ctx.fillRect(x, y, dayWidth, dayHeight); // 枠内を水色に塗りつぶす
            } else {
                ctx.fillStyle = "white"; // 通常は白
                ctx.fillRect(x, y, dayWidth, dayHeight); // 背景を白に戻す
            }

            // 文字色は常に黒
            ctx.fillStyle = "black";
            ctx.font = "16px 'Arial', sans-serif";
            ctx.fillText(day, x + dayWidth / 2, y + dayHeight / 2); // 日付を中央に描画

            // 枠線を描画（少し太め）
            ctx.strokeStyle = "#aaa"; // 明るいグレーで枠線を描画
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, dayWidth, dayHeight);

            day++;
        }
    }
}

// 日付をクリックして色を水色に変更（複数選択）
canvas.addEventListener('click', function(event) {
    const { month, year } = getCurrentMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const dayWidth = CANVAS_WIDTH / COLS;
    const dayHeight = CANVAS_HEIGHT / ROWS;

    // クリックした位置から日付を特定
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const col = Math.floor(mouseX / dayWidth);
    const row = Math.floor(mouseY / dayHeight);
    const day = (row - 1) * COLS + col - firstDayOfWeek + 1;

    if (day > 0 && day <= new Date(year, month + 1, 0).getDate()) {
        // 日付が選択されているかどうかを確認し、選択/解除を切り替える
        const index = selectedDays.indexOf(day);
        if (index === -1) {
            selectedDays.push(day); // まだ選択されていなければ選択リストに追加
        } else {
            selectedDays.splice(index, 1); // 既に選択されていれば選択リストから削除
        }
        drawCalendar(); // カレンダーを再描画
    }
});

// PNGとして書き出すボタン
document.getElementById('download-btn').addEventListener('click', function() {
    const image = canvas.toDataURL('image/png'); // canvasをPNG画像に変換
    const link = document.createElement('a');
    link.href = image;
    link.download = 'calendar.png'; // 画像ファイル名
    link.click(); // ダウンロード開始
});

// 初期カレンダー描画
drawCalendar();