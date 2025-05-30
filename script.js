document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const backButton = document.getElementById('backButton');
    const addTextButton = document.getElementById('addTextButton');
    const refreshButton = document.getElementById('refreshButton');
    const textArea = document.getElementById('textArea');
    const textInput = document.getElementById('textInput');
    const applyTextButton = document.getElementById('applyTextButton');

    let originalText = ''; // Orijinal metni saklamak için

    // Metin ekleme fonksiyonu
    addTextButton.addEventListener('click', () => {
        textInput.focus();
    });

    // Metni uygulama fonksiyonu
    applyTextButton.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            originalText = text; // Orijinal metni sakla
            textArea.textContent = text;
            textInput.value = ''; // Metin giriş alanını temizle
        }
    });

    // Yenileme fonksiyonu
    refreshButton.addEventListener('click', () => {
        if (originalText) {
            textArea.textContent = originalText;
            searchInput.value = ''; // Arama kutusunu temizle
        }
    });

    // Geri dönme fonksiyonu
    backButton.addEventListener('click', () => {
        if (originalText) {
            textArea.textContent = originalText;
            searchInput.value = ''; // Arama kutusunu temizle
        }
    });

    // Ana metin alanını salt okunur yap
    textArea.addEventListener('keydown', (e) => {
        e.preventDefault();
    });

    searchButton.addEventListener('click', () => {
        const searchText = searchInput.value.trim();
        if (!searchText) {
            alert('Lütfen bir arama terimi girin!');
            return;
        }

        const content = textArea.textContent;
        const searchTextLower = searchText.toLowerCase();
        const contentLower = content.toLowerCase();
        
        // Tüm eşleşmeleri bul
        let matches = [];
        let startIndex = 0;
        
        while (true) {
            const index = contentLower.indexOf(searchTextLower, startIndex);
            if (index === -1) break;
            
            matches.push({
                start: Math.max(0, index - 200),
                end: Math.min(content.length, index + searchText.length + 200),
                matchIndex: index
            });
            
            startIndex = index + 1;
        }

        if (matches.length === 0) {
            alert('Aranan metin bulunamadı!');
            return;
        }

        // Önceki vurgulamaları temizle
        const highlightedElements = textArea.getElementsByClassName('highlight');
        while (highlightedElements.length > 0) {
            const parent = highlightedElements[0].parentNode;
            parent.replaceChild(document.createTextNode(highlightedElements[0].textContent), highlightedElements[0]);
            parent.normalize();
        }

        // Yeni içeriği oluştur
        const newContent = document.createElement('div');
        
        matches.forEach((match, i) => {
            if (i > 0) {
                // Eşleşmeler arasına çizgi ekle
                const separator = document.createElement('div');
                separator.style.borderTop = '2px solid #666';
                separator.style.margin = '20px 0';
                newContent.appendChild(separator);
            }

            const beforeText = content.substring(match.start, match.matchIndex);
            const searchTextFound = content.substring(match.matchIndex, match.matchIndex + searchText.length);
            const afterText = content.substring(match.matchIndex + searchText.length, match.end);

            newContent.appendChild(document.createTextNode(beforeText));
            
            const highlightSpan = document.createElement('span');
            highlightSpan.className = 'highlight';
            highlightSpan.textContent = searchTextFound;
            newContent.appendChild(highlightSpan);
            
            newContent.appendChild(document.createTextNode(afterText));
        });

        // Metni güncelle
        textArea.innerHTML = '';
        textArea.appendChild(newContent);

        // İlk eşleşmeye scroll yap
        const firstHighlight = textArea.getElementsByClassName('highlight')[0];
        if (firstHighlight) {
            firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}); 