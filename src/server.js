const http = require('http'); // Chỉ cần http vì API nguồn dùng http://

const API_URL = 'http://36.50.135.125:3005/68gbmd5';
const PORT = process.env.PORT || 3000;
const INTERVAL = 5000;

// Biến lưu trữ dữ liệu thô (chuỗi) để trả về y chang bản gốc
let latestRawData = null;

function fetchAPI() {
  http.get(API_URL, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        // 1. Lưu toàn bộ chuỗi text gốc để giữ nguyên định dạng JSON
        latestRawData = body;
        
        // 2. Vẫn parse ra JSON để lấy thông tin log ra console
        const parsedData = JSON.parse(body);
        console.log(`[${new Date().toISOString()}] Phiên: ${parsedData.phien} | ${parsedData.ket_qua} | Dự đoán: ${parsedData.du_doan}`);
      } catch (e) {
        console.error('Parse lỗi:', e.message);
      }
    });
  }).on('error', (e) => console.error('Fetch lỗi:', e.message));
}

// Chạy lần đầu và thiết lập vòng lặp
fetchAPI();
setInterval(fetchAPI, INTERVAL);

http.createServer((req, res) => {
  // Thêm charset=utf-8 để hiển thị chuẩn tiếng Việt
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/68gbmd5') {
    // Trả về thẳng chuỗi thô (latestRawData) thay vì dùng JSON.stringify()
    res.end(latestRawData ? latestRawData : '{}');
  } else {
    res.end(JSON.stringify({ status: 'ok' }));
  }
}).listen(PORT, () => console.log(`Server đang chạy tại Port ${PORT}`));
