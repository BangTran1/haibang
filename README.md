# Portfolio với JavaScript & Three.js Effects

Portfolio cá nhân của Bang với các hiệu ứng tương tác nổi bật và đặc sắc được xây dựng bằng JavaScript và Three.js.

## ✨ Tính năng nổi bật

### 🌌 Random Background Effects
- **VCL Background**: Hiệu ứng galaxy 3D với Three.js (vcl.html)
- **Hack Background**: Hiệu ứng matrix rain với màu sắc gradient (hack.html)
- **Random Selection**: Mỗi lần refresh trang sẽ random chọn một trong hai background

### 🖱️ Tương tác nâng cao
- **Custom Cursor**: Con trỏ chuột tùy chỉnh với hiệu ứng hover
- **Magnetic Buttons**: Nút bấm có hiệu ứng từ tính
- **Ripple Effects**: Hiệu ứng sóng khi click
- **Glitch Effects**: Hiệu ứng glitch cho text đặc biệt

### 📱 Animations & Transitions
- **Typing Animation**: Hiệu ứng gõ chữ cho tiêu đề
- **Scroll Animations**: Element xuất hiện mượt mà khi scroll
- **Parallax Effects**: Hiệu ứng parallax cho hình ảnh
- **Staggered Animations**: Animation có độ trễ cho hiệu ứng tự nhiên

### 🎵 Audio & Visual
- **Particle Trail**: Vệt particles theo chuột
- **Sound Effects**: Âm thanh tinh tế cho tương tác
- **Progress Bar**: Thanh tiến trình scroll
- **Loading Animation**: Animation loading trang

## 🚀 Cách sử dụng

1. **Mở file `index.html`** trong trình duyệt
2. **Tương tác** với các element để trải nghiệm hiệu ứng
3. **Scroll** để xem các animation
4. **Hover** chuột để thấy các hiệu ứng đặc biệt

## 📁 Cấu trúc file

```
haibang/
├── index.html              # File HTML chính
├── vcl.html                # Galaxy 3D background (Three.js)
├── hack.html               # Matrix rain background
├── styles.css              # CSS styles và animations
├── script.js               # JavaScript cơ bản
├── advanced-effects.js     # Hiệu ứng nâng cao
├── performance-monitor.js  # Performance optimization
├── 1.jpg - 4.jpg          # Hình ảnh cá nhân
└── README.md              # Hướng dẫn này
```

## 🎯 Tối ưu Performance

- **Performance Monitor**: Tự động phát hiện và tối ưu cho thiết bị yếu
- **Responsive Design**: Tự động điều chỉnh hiệu ứng theo kích thước màn hình
- **Lazy Loading**: Tối ưu tải trang và tài nguyên

## 🛠️ Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa CSS variables trong `styles.css`:
```css
:root {
  --brand: #ddd1e9;     /* Màu chính */
  --brand-2: #3e3746;   /* Màu phụ */
  --brand-3: #a895c9;   /* Màu accent */
}
```

### Tắt hiệu ứng
Thêm class `prefers-reduced-motion` để tắt animations:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
```

### Thay đổi background
Để thêm hoặc thay đổi background, chỉnh sửa mảng `backgrounds` trong `index.html`:
```javascript
const backgrounds = ['vcl.html', 'hack.html', 'new-background.html'];
```

## 🌟 Hiệu ứng đặc biệt

1. **Random Background**: Mỗi lần refresh sẽ có background khác nhau
2. **Glitch Text**: Hover vào text có class `gradient-text`
3. **Magnetic Buttons**: Hover vào các nút để thấy hiệu ứng từ tính
4. **Scroll Progress**: Thanh tiến trình ở đầu trang
5. **Ripple Effect**: Click vào nút để thấy hiệu ứng sóng
6. **Typing Animation**: Hiệu ứng gõ chữ cho tiêu đề

## 📱 Responsive Design

Portfolio được tối ưu cho mọi thiết bị:
- **Desktop**: Trải nghiệm đầy đủ với tất cả hiệu ứng
- **Tablet**: Giảm hiệu ứng nặng, giữ UX mượt mà
- **Mobile**: Tối ưu performance, focus vào nội dung

## 🔧 Yêu cầu kỹ thuật

- **Trình duyệt**: Chrome, Firefox, Safari, Edge (phiên bản mới)
- **JavaScript**: ES6+ support
- **WebGL**: Để chạy Three.js effects
- **Performance**: GPU acceleration được khuyến nghị

## 📄 License

© 2025 Bang Tran. Made with ❤️

---

**Lưu ý**: Portfolio này được tối ưu cho trải nghiệm desktop. Trên mobile, một số hiệu ứng sẽ được tắt để đảm bảo performance tốt nhất.
