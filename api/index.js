const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// JSONボディパーサー
app.use(express.json({ limit: '10mb' }));

// 静的ファイル配信 (Vercelでは /public ディレクトリが自動配信されるため、ここではAPIのみ)
// 静的ファイルは vercel.json の routes で /public にフォールバックする

// ============================================
// API エンドポイント
// ============================================

// ページデータ取得
app.get('/api/pages', (req, res) => {
  try {
    const data = loadPageData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 特定のページ取得
app.get('/api/pages/:id', (req, res) => {
  try {
    const data = loadPageData();
    const page = data.pages[req.params.id];
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ページデータ保存
app.put('/api/pages/:id', (req, res) => {
  try {
    const data = loadPageData();
    data.pages[req.params.id] = req.body;
    savePageData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ブロック更新
app.put('/api/pages/:pageId/blocks/:blockId', (req, res) => {
  try {
    const data = loadPageData();
    const page = data.pages[req.params.pageId];
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const blockIndex = page.blocks.findIndex(b => b.id === req.params.blockId);
    if (blockIndex === -1) {
      return res.status(404).json({ error: 'Block not found' });
    }
    
    page.blocks[blockIndex] = { ...page.blocks[blockIndex], ...req.body };
    savePageData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ブロック追加
app.post('/api/pages/:pageId/blocks', (req, res) => {
  try {
    const data = loadPageData();
    const page = data.pages[req.params.pageId];
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const newBlock = {
      id: 'block_' + Math.random().toString(36).substr(2, 9),
      type: req.body.type || 'text',
      title: req.body.title || '新しいブロック',
      properties: req.body.properties || {},
      content: req.body.content || '<p>コンテンツを入力してください</p>',
      originalContent: '',
      cleanText: ''
    };
    
    page.blocks.push(newBlock);
    savePageData(data);
    res.json(newBlock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ブロック削除
app.delete('/api/pages/:pageId/blocks/:blockId', (req, res) => {
  try {
    const data = loadPageData();
    const page = data.pages[req.params.pageId];
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    page.blocks = page.blocks.filter(b => b.id !== req.params.blockId);
    savePageData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ブロック並べ替え
app.put('/api/pages/:pageId/reorder', (req, res) => {
  try {
    const data = loadPageData();
    const page = data.pages[req.params.pageId];
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const { blockIds } = req.body;
    const reorderedBlocks = blockIds.map(id => page.blocks.find(b => b.id === id)).filter(Boolean);
    page.blocks = reorderedBlocks;
    
    savePageData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// サイト生成（静的HTML）
app.post('/api/generate', (req, res) => {
  try {
    const data = loadPageData();
    const outputDir = path.join(__dirname, '..', 'output');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 各ページをHTMLに変換
    for (const pageId in data.pages) {
      const page = data.pages[pageId];
      const html = generatePageHTML(page, data.siteName);
      const filename = pageId === 'index' ? 'index.html' : `${pageId}.html`;
      fs.writeFileSync(path.join(outputDir, filename), html, 'utf-8');
    }
    
    // CSSをコピー
    const cssDir = path.join(outputDir, 'css');
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true });
    }
    fs.copyFileSync(path.join(__dirname, '..', 'css', 'style.css'), path.join(cssDir, 'style.css'));
    
    // 画像をコピー
    const imagesDir = path.join(outputDir, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    const srcImages = path.join(__dirname, '..', 'images');
    if (fs.existsSync(srcImages)) {
      fs.readdirSync(srcImages).forEach(file => {
        fs.copyFileSync(path.join(srcImages, file), path.join(imagesDir, file));
      });
    }
    
    res.json({ success: true, outputDir });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ページ追加
app.post('/api/pages', (req, res) => {
  try {
    const data = loadPageData();
    const newPage = {
      id: req.body.id || 'page_' + Math.random().toString(36).substr(2, 6),
      title: req.body.title || '新しいページ',
      originalFile: '',
      blocks: [],
      metadata: { description: '', keywords: '' }
    };
    
    data.pages[newPage.id] = newPage;
    savePageData(data);
    res.json(newPage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ページ削除
app.delete('/api/pages/:id', (req, res) => {
  try {
    const data = loadPageData();
    delete data.pages[req.params.id];
    savePageData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// ヘルパー関数
// ============================================

function loadPageData() {
  // Vercel Serverless Functionsでは /tmp に書き込み可能
  // 本番では外部ストレージを使うのが理想だが、ここでは /tmp を使用
  const dataPath = path.join('/tmp', 'pages.json');
  const defaultPath = path.join(__dirname, '..', 'data', 'pages.json');
  
  if (fs.existsSync(dataPath)) {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }
  if (fs.existsSync(defaultPath)) {
    return JSON.parse(fs.readFileSync(defaultPath, 'utf-8'));
  }
  return { siteName: 'インクライン株式会社', pages: {} };
}

function savePageData(data) {
  const dataPath = path.join('/tmp', 'pages.json');
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

function generatePageHTML(page, siteName) {
  const blocksHTML = page.blocks.map(block => {
    const style = `background-color: ${block.properties.backgroundColor || 'transparent'}; padding: ${block.properties.padding || '20px'}; text-align: ${block.properties.textAlign || 'left'};`;
    
    return `
    <div class="block block-${block.type}" data-block-id="${block.id}" style="${style}">
      <h3 class="block-title">${escapeHtml(block.title)}</h3>
      <div class="block-content">
        ${block.content}
      </div>
    </div>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(page.title)} | ${escapeHtml(siteName)}</title>
  <link rel="stylesheet" href="/css/style.css">
  <style>
    .block { margin: 20px 0; padding: 20px; }
    .block-title { color: #0068b7; border-bottom: 2px solid #0068b7; padding-bottom: 10px; }
    .block-content { margin-top: 15px; }
    .block-image img { max-width: 100%; height: auto; }
    .block-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
    .block-gallery img { width: 100%; height: auto; border-radius: 4px; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(siteName)}</h1>
    <nav>
      <a href="/index.html">トップ</a>
      <a href="/company.html">会社概要</a>
      <a href="/contents.html">事業内容</a>
      <a href="/news.html">ニュース</a>
      <a href="/recruit.html">採用情報</a>
      <a href="/contact.html">お問い合わせ</a>
    </nav>
  </header>
  
  <main>
    ${blocksHTML}
  </main>
  
  <footer>
    <p>Copyright (C) ${escapeHtml(siteName)} All Rights Reserved.</p>
  </footer>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

module.exports = app;
