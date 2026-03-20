const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icon imports
const { FaFolder, FaFileAlt, FaCode, FaBook, FaImages, FaCogs, FaRocket, FaCheckCircle, FaBug, FaChartLine, FaUsers, FaPlug, FaLayerGroup, FaLightbulb, FaExclamationTriangle, FaClipboardList, FaArrowRight, FaSyncAlt, FaBrain, FaTools, FaGlobe, FaQuestionCircle, FaSearch, FaUpload, FaGithub } = require("react-icons/fa");
const { MdKitchen, MdMenuBook, MdSpeed, MdCompareArrows } = require("react-icons/md");
const { HiOutlineDocumentText } = require("react-icons/hi");

function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// ============= COLOR PALETTE =============
// Using a professional teal/dark theme
const C = {
  darkBg: "1A1F36",      // dark navy for title/section slides
  darkBg2: "242B4A",     // slightly lighter dark
  teal: "0D9488",        // primary accent
  tealLight: "14B8A6",   // lighter teal
  mint: "5EEAD4",        // bright accent
  white: "FFFFFF",
  offWhite: "F8FAFC",    // content slide background
  lightGray: "E2E8F0",
  midGray: "64748B",
  darkText: "1E293B",
  bodyText: "334155",
  cardBg: "FFFFFF",
  warmAccent: "F59E0B",  // amber for highlights
  red: "EF4444",
  green: "10B981",
  coral: "F97316",
};

// ============= HELPERS =============
const makeShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.1 });

function addDarkSectionSlide(pres, chapterNum, title) {
  let slide = pres.addSlide();
  slide.background = { color: C.darkBg };
  // Accent shape top-right
  slide.addShape(pres.shapes.RECTANGLE, { x: 7, y: 0, w: 3, h: 0.08, fill: { color: C.teal } });
  // Chapter label
  slide.addText(`Part ${chapterNum}`, {
    x: 0.8, y: 1.8, w: 8, h: 0.5,
    fontSize: 16, fontFace: "Calibri", color: C.teal, bold: true, margin: 0
  });
  // Title
  slide.addText(title, {
    x: 0.8, y: 2.3, w: 8, h: 1.5,
    fontSize: 40, fontFace: "Georgia", color: C.white, bold: true, margin: 0
  });
  // Bottom accent line
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.8, w: 2, h: 0.04, fill: { color: C.teal } });
  return slide;
}

function addContentSlide(pres, title) {
  let slide = pres.addSlide();
  slide.background = { color: C.offWhite };
  // Top bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
  // Title
  slide.addText(title, {
    x: 0.7, y: 0.25, w: 8.6, h: 0.55,
    fontSize: 24, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0
  });
  // Title underline
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 0.85, w: 1.5, h: 0.03, fill: { color: C.teal } });
  return slide;
}

async function addIconCircle(slide, icon, color, x, y, size) {
  // Circle background
  slide.addShape("ellipse", {
    x: x, y: y, w: size, h: size,
    fill: { color: color, transparency: 85 }
  });
  const iconData = await iconToBase64Png(icon, `#${color}`, 256);
  const iconSize = size * 0.5;
  const iconOffset = (size - iconSize) / 2;
  slide.addImage({
    data: iconData,
    x: x + iconOffset, y: y + iconOffset, w: iconSize, h: iconSize
  });
}

function addCard(slide, pres, x, y, w, h, accentColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: w, h: h,
    fill: { color: C.cardBg },
    shadow: makeShadow()
  });
  // Left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 0.06, h: h,
    fill: { color: accentColor || C.teal }
  });
}

// ============= MAIN =============
async function createPresentation() {
  let pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Frank";
  pres.title = "From Prompt Engineering to Skill Packaging: Exploring Claude Skills Architecture";

  // ========================
  // SLIDE 1: COVER
  // ========================
  {
    let slide = pres.addSlide();
    slide.background = { color: C.darkBg };
    // Decorative shapes
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.teal } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 7.5, y: 0.08, w: 2.5, h: 5.545, fill: { color: C.darkBg2 } });
    // Accent circles (decorative)
    slide.addShape("ellipse", { x: 8.2, y: 1.2, w: 1.2, h: 1.2, fill: { color: C.teal, transparency: 80 } });
    slide.addShape("ellipse", { x: 8.8, y: 2.8, w: 0.8, h: 0.8, fill: { color: C.mint, transparency: 80 } });
    // Title
    slide.addText([
      { text: "從提示工程到技能封裝", options: { fontSize: 14, color: C.teal, bold: true, breakLine: true } },
      { text: "探索 Claude Skills", options: { fontSize: 38, color: C.white, bold: true, fontFace: "Georgia", breakLine: true } },
      { text: "的架構與應用", options: { fontSize: 38, color: C.white, bold: true, fontFace: "Georgia" } }
    ], { x: 0.8, y: 1.0, w: 6.5, h: 2.5, margin: 0 });
    // Info
    slide.addText([
      { text: "演講者：Frank", options: { fontSize: 14, color: C.midGray, breakLine: true } },
      { text: "2026/03/24", options: { fontSize: 14, color: C.midGray, breakLine: true } },
      { text: "國立台北科技大學　資訊工程系", options: { fontSize: 12, color: C.midGray, breakLine: true } },
      { text: "指導教授：鄭有進、謝金雲", options: { fontSize: 12, color: C.midGray } }
    ], { x: 0.8, y: 3.8, w: 6, h: 1.5, margin: 0 });
  }

  // ========================
  // SLIDE 2: OUTLINE
  // ========================
  {
    let slide = pres.addSlide();
    slide.background = { color: C.offWhite };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
    slide.addText("Outline", {
      x: 0.7, y: 0.3, w: 8, h: 0.6,
      fontSize: 28, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0
    });

    const sections = [
      { num: "1", title: "什麼是 Skill？", desc: "定義、結構與核心設計原則" },
      { num: "2", title: "Skills + MCP", desc: "知識層與連接層的協作關係" },
      { num: "3", title: "規劃與設計", desc: "使用案例、YAML Frontmatter、指令撰寫" },
      { num: "4", title: "測試與迭代", desc: "成功標準、測試方法、Skill-Creator" },
      { num: "5", title: "發布與設計模式", desc: "發布方式、五大模式、問題排除" }
    ];

    sections.forEach((s, i) => {
      const yBase = 1.15 + i * 0.82;
      // Number circle
      slide.addShape("ellipse", {
        x: 0.7, y: yBase, w: 0.5, h: 0.5,
        fill: { color: C.teal }
      });
      slide.addText(s.num, {
        x: 0.7, y: yBase, w: 0.5, h: 0.5,
        fontSize: 16, fontFace: "Calibri", color: C.white, bold: true,
        align: "center", valign: "middle", margin: 0
      });
      // Title + desc
      slide.addText(s.title, {
        x: 1.4, y: yBase + 0.02, w: 7, h: 0.3,
        fontSize: 16, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0
      });
      slide.addText(s.desc, {
        x: 1.4, y: yBase + 0.32, w: 7, h: 0.25,
        fontSize: 12, fontFace: "Calibri", color: C.midGray, margin: 0
      });
    });
  }

  // ========================
  // SLIDE 3: What is Skill?
  // ========================
  {
    let slide = addContentSlide(pres, "什麼是 Skill？");

    // Left side: definition
    addCard(slide, pres, 0.7, 1.15, 4.2, 1.8, C.teal);
    slide.addText([
      { text: "一組打包成資料夾的指令集", options: { fontSize: 15, bold: true, color: C.darkText, breakLine: true } },
      { text: "教導 Claude 處理特定任務或工作流程", options: { fontSize: 13, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 8, breakLine: true } },
      { text: "教 Claude 一次，之後每次對話都能受益", options: { fontSize: 13, color: C.teal, bold: true } }
    ], { x: 0.95, y: 1.3, w: 3.8, h: 1.5, margin: 0 });

    // Right side: use cases
    addCard(slide, pres, 5.2, 1.15, 4.2, 1.8, C.warmAccent);
    slide.addText("適用場景：可重複的工作流程", {
      x: 5.45, y: 1.25, w: 3.8, h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: C.warmAccent, bold: true, margin: 0
    });
    slide.addText([
      { text: "從規格生成前端設計", options: { bullet: true, fontSize: 12, color: C.bodyText, breakLine: true } },
      { text: "以一致方法進行研究", options: { bullet: true, fontSize: 12, color: C.bodyText, breakLine: true } },
      { text: "建立遵循團隊風格的文件", options: { bullet: true, fontSize: 12, color: C.bodyText, breakLine: true } },
      { text: "協調多步驟流程", options: { bullet: true, fontSize: 12, color: C.bodyText } }
    ], { x: 5.45, y: 1.65, w: 3.8, h: 1.1, margin: 0 });

    // Bottom: two paths
    slide.addText("本指南的兩條路徑", {
      x: 0.7, y: 3.25, w: 8.6, h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0
    });

    // Path 1
    addCard(slide, pres, 0.7, 3.7, 4.2, 1.1, C.teal);
    slide.addText([
      { text: "獨立 Skill 開發者", options: { fontSize: 13, bold: true, color: C.teal, breakLine: true } },
      { text: "聚焦 Fundamentals + Planning (Cat. 1-2)", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 0.95, y: 3.8, w: 3.8, h: 0.85, margin: 0 });

    // Path 2
    addCard(slide, pres, 5.2, 3.7, 4.2, 1.1, C.coral);
    slide.addText([
      { text: "MCP 整合開發者", options: { fontSize: 13, bold: true, color: C.coral, breakLine: true } },
      { text: "聚焦 Skills + MCP 段落 (Cat. 3)", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 5.45, y: 3.8, w: 3.8, h: 0.85, margin: 0 });
  }

  // ========================
  // SLIDE 4: Progressive Disclosure (dedicated)
  // ========================
  {
    let slide = addContentSlide(pres, "漸進式揭露（Progressive Disclosure）");

    // Three-layer visual
    const layers = [
      { label: "Layer 1", title: "YAML Frontmatter", desc: "永遠載入，判斷何時使用", color: C.teal, y: 1.2 },
      { label: "Layer 2", title: "SKILL.md 主體", desc: "相關時載入，完整指令", color: C.tealLight, y: 2.45 },
      { label: "Layer 3", title: "references/ 連結檔", desc: "按需載入，深度參考", color: C.mint, y: 3.7 }
    ];

    layers.forEach((l, i) => {
      // Layer card - pyramid shape (wider as we go down)
      const indent = (2 - i) * 0.5;
      const w = 5 - indent;
      const xStart = 0.7 + indent / 2;
      addCard(slide, pres, xStart, l.y, w, 0.95, l.color);
      slide.addText(l.label, {
        x: xStart + 0.2, y: l.y + 0.1, w: 1.2, h: 0.3,
        fontSize: 10, color: l.color, bold: true, margin: 0
      });
      slide.addText(l.title, {
        x: xStart + 0.2, y: l.y + 0.35, w: w - 0.5, h: 0.25,
        fontSize: 14, color: C.darkText, bold: true, margin: 0
      });
      slide.addText(l.desc, {
        x: xStart + 0.2, y: l.y + 0.6, w: w - 0.5, h: 0.25,
        fontSize: 11, color: C.midGray, margin: 0
      });

      // Arrow between layers
      if (i < 2) {
        slide.addText("▼", {
          x: 2.5, y: l.y + 0.95, w: 0.5, h: 0.35,
          fontSize: 14, color: C.midGray, align: "center", margin: 0
        });
      }
    });

    // Right side: benefit
    addCard(slide, pres, 5.7, 1.2, 3.7, 2.0, C.warmAccent);
    slide.addText([
      { text: "核心效益", options: { fontSize: 14, bold: true, color: C.warmAccent, breakLine: true } },
      { text: "", options: { fontSize: 6, breakLine: true } },
      { text: "最小化 Token 使用量", options: { fontSize: 13, bold: true, color: C.darkText, breakLine: true } },
      { text: "同時保持專業能力", options: { fontSize: 13, bold: true, color: C.darkText, breakLine: true } },
      { text: "", options: { fontSize: 6, breakLine: true } },
      { text: "只在需要時載入需要的資訊", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 5.9, y: 1.35, w: 3.3, h: 1.7, margin: 0 });

    // Right bottom: other principles
    addCard(slide, pres, 5.7, 3.5, 3.7, 1.4, C.teal);
    slide.addText([
      { text: "其他設計原則", options: { fontSize: 13, bold: true, color: C.teal, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "可組合性：多個 Skill 可同時協同運作", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "可攜性：Claude.ai / Code / API 運作一致", options: { bullet: true, fontSize: 11, color: C.bodyText } }
    ], { x: 5.9, y: 3.6, w: 3.3, h: 1.2, margin: 0 });
  }

  // ========================
  // SLIDE 5: Skills + MCP Kitchen Analogy
  // ========================
  {
    let slide = addContentSlide(pres, "Skills + MCP：廚房比喻");

    // Left: MCP = Kitchen
    addCard(slide, pres, 0.7, 1.15, 4.1, 2.2, C.coral);
    const kitchenIcon = await iconToBase64Png(MdKitchen, `#${C.coral}`, 256);
    slide.addImage({ data: kitchenIcon, x: 0.95, y: 1.3, w: 0.45, h: 0.45 });
    slide.addText("MCP = 專業廚房（連接層）", {
      x: 1.5, y: 1.3, w: 3.1, h: 0.4,
      fontSize: 14, bold: true, color: C.coral, margin: 0
    });
    slide.addText([
      { text: "連接 Claude 到服務（Notion, Linear...）", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "提供即時資料存取和工具調用", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "回答：Claude 能做什麼？", options: { fontSize: 12, bold: true, color: C.coral, breakLine: true } }
    ], { x: 0.95, y: 1.8, w: 3.6, h: 1.3, margin: 0 });

    // Right: Skills = Recipes
    addCard(slide, pres, 5.2, 1.15, 4.1, 2.2, C.teal);
    const recipeIcon = await iconToBase64Png(MdMenuBook, `#${C.teal}`, 256);
    slide.addImage({ data: recipeIcon, x: 5.45, y: 1.3, w: 0.45, h: 0.45 });
    slide.addText("Skills = 食譜（知識層）", {
      x: 6.0, y: 1.3, w: 3.1, h: 0.4,
      fontSize: 14, bold: true, color: C.teal, margin: 0
    });
    slide.addText([
      { text: "教導 Claude 如何使用服務", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "捕捉工作流程和最佳實踐", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "回答：Claude 該怎麼做？", options: { fontSize: 12, bold: true, color: C.teal, breakLine: true } }
    ], { x: 5.45, y: 1.8, w: 3.6, h: 1.3, margin: 0 });

    // Bottom comparison: Without vs With
    // Without
    addCard(slide, pres, 0.7, 3.65, 4.1, 1.55, C.red);
    slide.addText("沒有 Skills 時", {
      x: 0.95, y: 3.75, w: 3.5, h: 0.3,
      fontSize: 13, bold: true, color: C.red, margin: 0
    });
    slide.addText([
      { text: "使用者不知道下一步", options: { bullet: true, fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "每次對話從零開始", options: { bullet: true, fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "結果不一致，用戶歸哎於連接器", options: { bullet: true, fontSize: 10, color: C.bodyText } }
    ], { x: 0.95, y: 4.1, w: 3.6, h: 0.95, margin: 0 });

    // With
    addCard(slide, pres, 5.2, 3.65, 4.1, 1.55, C.green);
    slide.addText("有 Skills 時", {
      x: 5.45, y: 3.75, w: 3.5, h: 0.3,
      fontSize: 13, bold: true, color: C.green, margin: 0
    });
    slide.addText([
      { text: "預建工作流程自動啟動", options: { bullet: true, fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "一致且可靠的工具使用", options: { bullet: true, fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "降低整合的學習曲線", options: { bullet: true, fontSize: 10, color: C.bodyText } }
    ], { x: 5.45, y: 4.1, w: 3.6, h: 0.95, margin: 0 });
  }

  // ========================
  // SLIDE 6: Category 1 - Document & Asset
  // ========================
  {
    let slide = addContentSlide(pres, "Category 1：文件與資產建立");

    addCard(slide, pres, 0.7, 1.15, 8.6, 1.4, C.teal);
    slide.addText([
      { text: "建立一致、高品質的輸出（文件、簡報、程式碼）", options: { fontSize: 14, bold: true, color: C.darkText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "範例：frontend-design skill", options: { fontSize: 12, color: C.teal, bold: true, breakLine: true } },
      { text: "「Create distinctive, production-grade frontend interfaces with high design quality.」", options: { fontSize: 11, color: C.midGray, italic: true } }
    ], { x: 0.95, y: 1.25, w: 8.1, h: 1.2, margin: 0 });

    // Key techniques as icon cards
    slide.addText("關鍵技巧", {
      x: 0.7, y: 2.8, w: 8, h: 0.35,
      fontSize: 14, bold: true, color: C.darkText, margin: 0
    });

    const techniques = [
      { title: "風格指南", desc: "嵌入品牌標準", color: C.teal },
      { title: "範本結構", desc: "確保輸出一致性", color: C.tealLight },
      { title: "品質檢查清單", desc: "完成前確認品質", color: C.warmAccent },
      { title: "無需外部工具", desc: "使用 Claude 內建能力", color: C.coral }
    ];

    techniques.forEach((t, i) => {
      const x = 0.7 + i * 2.25;
      addCard(slide, pres, x, 3.25, 2.05, 1.3, t.color);
      slide.addText(t.title, {
        x: x + 0.2, y: 3.4, w: 1.7, h: 0.35,
        fontSize: 13, bold: true, color: t.color, margin: 0
      });
      slide.addText(t.desc, {
        x: x + 0.2, y: 3.75, w: 1.7, h: 0.5,
        fontSize: 11, color: C.bodyText, margin: 0
      });
    });
  }

  // ========================
  // SLIDE 7: Category 2 & 3
  // ========================
  {
    let slide = addContentSlide(pres, "Category 2 & 3：工作流程自動化 & MCP 增強");

    // Cat 2
    addCard(slide, pres, 0.7, 1.15, 4.2, 2.3, C.tealLight);
    slide.addText("Cat 2：工作流程自動化", {
      x: 0.95, y: 1.25, w: 3.8, h: 0.35,
      fontSize: 14, bold: true, color: C.tealLight, margin: 0
    });
    slide.addText([
      { text: "多步驟流程，需要一致方法論", options: { fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "範例：skill-creator skill", options: { fontSize: 11, color: C.teal, bold: true, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "技巧：", options: { fontSize: 11, bold: true, color: C.darkText, breakLine: true } },
      { text: "驗證關卡的逐步工作流程", options: { bullet: true, fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "迭代精煉循環", options: { bullet: true, fontSize: 10, color: C.bodyText } }
    ], { x: 0.95, y: 1.65, w: 3.8, h: 1.6, margin: 0 });

    // Cat 3
    addCard(slide, pres, 5.2, 1.15, 4.2, 2.3, C.coral);
    slide.addText("Cat 3：MCP 增強", {
      x: 5.45, y: 1.25, w: 3.8, h: 0.35,
      fontSize: 14, bold: true, color: C.coral, margin: 0
    });
    slide.addText([
      { text: "為 MCP 工具加上工作流程引導", options: { fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "範例：sentry-code-review skill", options: { fontSize: 11, color: C.coral, bold: true, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "技巧：", options: { fontSize: 11, bold: true, color: C.darkText, breakLine: true } },
      { text: "多 MCP 協調、領域知識嵌入", options: { bullet: true, fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "錯誤處理", options: { bullet: true, fontSize: 10, color: C.bodyText } }
    ], { x: 5.45, y: 1.65, w: 3.8, h: 1.6, margin: 0 });

    // Sprint Planning template
    addCard(slide, pres, 0.7, 3.75, 8.6, 1.5, C.warmAccent);
    slide.addText("使用案例範本（Sprint Planning）", {
      x: 0.95, y: 3.85, w: 8, h: 0.3,
      fontSize: 13, bold: true, color: C.warmAccent, margin: 0
    });

    // Flow steps
    const steps = ["Trigger:\n「help me plan\nthis sprint」", "Step 1:\n取得專案\n狀態", "Step 2:\n分析\n產能", "Step 3:\n建議優先\n順序", "Step 4:\n建立\n任務", "Result:\n完整的\nSprint 計畫"];
    steps.forEach((s, i) => {
      const x = 0.95 + i * 1.4;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: x, y: 4.2, w: 1.2, h: 0.9,
        fill: { color: i === 0 ? C.warmAccent : (i === 5 ? C.teal : C.lightGray) }
      });
      slide.addText(s, {
        x: x, y: 4.2, w: 1.2, h: 0.9,
        fontSize: 8, color: (i === 0 || i === 5) ? C.white : C.darkText,
        align: "center", valign: "middle", bold: i === 0 || i === 5, margin: 2
      });
      if (i < 5) {
        slide.addText("▶", {
          x: x + 1.2, y: 4.45, w: 0.2, h: 0.4,
          fontSize: 10, color: C.midGray, align: "center", margin: 0
        });
      }
    });
  }

  // ========================
  // SLIDE 8: File Structure
  // ========================
  {
    let slide = addContentSlide(pres, "Skill 的檔案結構與命名規則");

    // Left: folder structure
    addCard(slide, pres, 0.7, 1.15, 4.5, 2.8, C.teal);
    slide.addText("資料夾結構", {
      x: 0.95, y: 1.25, w: 4, h: 0.3,
      fontSize: 14, bold: true, color: C.teal, margin: 0
    });
    slide.addText([
      { text: "your-skill-name/", options: { fontFace: "Consolas", fontSize: 11, color: C.darkText, bold: true, breakLine: true } },
      { text: "  SKILL.md       (必要)", options: { fontFace: "Consolas", fontSize: 10, color: C.teal, breakLine: true } },
      { text: "  scripts/       (選用)", options: { fontFace: "Consolas", fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "  references/    (選用)", options: { fontFace: "Consolas", fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "  assets/        (選用)", options: { fontFace: "Consolas", fontSize: 10, color: C.bodyText } }
    ], { x: 0.95, y: 1.65, w: 4, h: 2, margin: 0 });

    // Right: Naming rules
    addCard(slide, pres, 5.5, 1.15, 3.9, 2.8, C.coral);
    slide.addText("關鍵規則", {
      x: 5.75, y: 1.25, w: 3.5, h: 0.3,
      fontSize: 14, bold: true, color: C.coral, margin: 0
    });
    slide.addText([
      { text: "SKILL.md 大小寫敏感", options: { fontSize: 12, bold: true, color: C.darkText, breakLine: true } },
      { text: "只接受 SKILL.md 這個拼法", options: { fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 6, breakLine: true } },
      { text: "資料夾用 kebab-case", options: { fontSize: 12, bold: true, color: C.darkText, breakLine: true } },
      { text: "notion-project-setup  ✅", options: { fontFace: "Consolas", fontSize: 10, color: C.green, breakLine: true } },
      { text: "Notion Project Setup  ❌", options: { fontFace: "Consolas", fontSize: 10, color: C.red, breakLine: true } },
      { text: "notion_project_setup  ❌", options: { fontFace: "Consolas", fontSize: 10, color: C.red, breakLine: true } },
      { text: "", options: { fontSize: 6, breakLine: true } },
      { text: "不放 README.md", options: { fontSize: 12, bold: true, color: C.darkText, breakLine: true } },
      { text: "文件放 SKILL.md 或 references/", options: { fontSize: 10, color: C.bodyText } }
    ], { x: 5.75, y: 1.65, w: 3.5, h: 2.2, margin: 0 });

    // Bottom: security
    addCard(slide, pres, 0.7, 4.25, 8.6, 0.95, C.red);
    const warnIcon = await iconToBase64Png(FaExclamationTriangle, `#${C.red}`, 256);
    slide.addImage({ data: warnIcon, x: 0.95, y: 4.4, w: 0.35, h: 0.35 });
    slide.addText([
      { text: "安全限制：", options: { fontSize: 12, bold: true, color: C.red } },
      { text: " 禁止 XML 標籤 (< >) / 名稱不可含 「claude」或「anthropic」（保留字）", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 1.4, y: 4.4, w: 7.5, h: 0.35, margin: 0 });
    slide.addText("原因：Frontmatter 出現在 Claude 的 system prompt 中，惡意內容可能注入指令", {
      x: 1.4, y: 4.75, w: 7.5, h: 0.3,
      fontSize: 10, color: C.midGray, margin: 0
    });
  }

  // ========================
  // SLIDE 9: YAML Frontmatter
  // ========================
  {
    let slide = addContentSlide(pres, "YAML Frontmatter");

    // Minimal format
    addCard(slide, pres, 0.7, 1.15, 4.5, 2.2, C.teal);
    slide.addText("最小必要格式", {
      x: 0.95, y: 1.25, w: 4, h: 0.3,
      fontSize: 14, bold: true, color: C.teal, margin: 0
    });
    slide.addText([
      { text: "---", options: { fontFace: "Consolas", fontSize: 11, color: C.midGray, breakLine: true } },
      { text: "name: your-skill-name", options: { fontFace: "Consolas", fontSize: 11, color: C.darkText, breakLine: true } },
      { text: "description: What it does.", options: { fontFace: "Consolas", fontSize: 11, color: C.darkText, breakLine: true } },
      { text: "  Use when user asks to", options: { fontFace: "Consolas", fontSize: 11, color: C.darkText, breakLine: true } },
      { text: "  [specific phrases].", options: { fontFace: "Consolas", fontSize: 11, color: C.darkText, breakLine: true } },
      { text: "---", options: { fontFace: "Consolas", fontSize: 11, color: C.midGray } }
    ], { x: 0.95, y: 1.7, w: 4, h: 1.5, margin: 0 });

    // Optional fields
    addCard(slide, pres, 5.5, 1.15, 3.9, 2.2, C.warmAccent);
    slide.addText("選用欄位", {
      x: 5.75, y: 1.25, w: 3.5, h: 0.3,
      fontSize: 14, bold: true, color: C.warmAccent, margin: 0
    });
    slide.addText([
      { text: "license:", options: { fontFace: "Consolas", fontSize: 11, bold: true, color: C.darkText, breakLine: true } },
      { text: "  MIT, Apache-2.0 等", options: { fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "compatibility:", options: { fontFace: "Consolas", fontSize: 11, bold: true, color: C.darkText, breakLine: true } },
      { text: "  環境需求（1-500 字元）", options: { fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "allowed-tools:", options: { fontFace: "Consolas", fontSize: 11, bold: true, color: C.darkText, breakLine: true } },
      { text: "  限制工具存取", options: { fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "metadata:", options: { fontFace: "Consolas", fontSize: 11, bold: true, color: C.darkText, breakLine: true } },
      { text: "  author, version, mcp-server", options: { fontSize: 10, color: C.bodyText } }
    ], { x: 5.75, y: 1.65, w: 3.5, h: 1.6, margin: 0 });

    // Field requirements summary
    addCard(slide, pres, 0.7, 3.65, 8.6, 1.55, C.teal);
    slide.addText("欄位要求摘要", {
      x: 0.95, y: 3.75, w: 8, h: 0.3,
      fontSize: 13, bold: true, color: C.teal, margin: 0
    });

    // Table
    slide.addTable([
      [
        { text: "欄位", options: { bold: true, color: C.white, fill: { color: C.teal }, fontSize: 10 } },
        { text: "規則", options: { bold: true, color: C.white, fill: { color: C.teal }, fontSize: 10 } }
      ],
      [
        { text: "name", options: { fontFace: "Consolas", fontSize: 10 } },
        { text: "kebab-case，無空格或大寫，應與資料夾名稱一致", options: { fontSize: 10 } }
      ],
      [
        { text: "description", options: { fontFace: "Consolas", fontSize: 10 } },
        { text: "必須包含「做什麼」+「何時用」，上限 1024 字元，禁 XML 標籤", options: { fontSize: 10 } }
      ]
    ], {
      x: 0.95, y: 4.1, w: 8.1, h: 0.9,
      border: { pt: 0.5, color: C.lightGray },
      colW: [1.5, 6.6]
    });
  }

  // ========================
  // SLIDE 10: Description Good/Bad
  // ========================
  {
    let slide = addContentSlide(pres, "Description：Skill 成敗的關鍵");

    // Good example
    addCard(slide, pres, 0.7, 1.15, 8.6, 1.5, C.green);
    slide.addText("✅ 好的 Description", {
      x: 0.95, y: 1.25, w: 8, h: 0.3,
      fontSize: 13, bold: true, color: C.green, margin: 0
    });
    slide.addText([
      { text: "具體說明「做什麼」 + 包含「何時使用」的觸發詞 + 提及相關檔案類型", options: { fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "「Manages Linear workflows including sprint planning. Use when user mentions sprint, Linear tasks, or project planning.」", options: { fontFace: "Consolas", fontSize: 10, color: C.darkText, italic: true } }
    ], { x: 0.95, y: 1.6, w: 8.1, h: 0.9, margin: 0 });

    // Bad examples
    addCard(slide, pres, 0.7, 2.9, 8.6, 1.8, C.red);
    slide.addText("❌ 壞的 Description", {
      x: 0.95, y: 3.0, w: 8, h: 0.3,
      fontSize: 13, bold: true, color: C.red, margin: 0
    });

    slide.addTable([
      [
        { text: "問題", options: { bold: true, color: C.white, fill: { color: C.red }, fontSize: 10 } },
        { text: "範例", options: { bold: true, color: C.white, fill: { color: C.red }, fontSize: 10 } },
        { text: "原因", options: { bold: true, color: C.white, fill: { color: C.red }, fontSize: 10 } }
      ],
      [
        { text: "太模糊", options: { fontSize: 10, bold: true } },
        { text: "「Helps with projects」", options: { fontFace: "Consolas", fontSize: 9 } },
        { text: "Claude 幾乎不會觸發", options: { fontSize: 10 } }
      ],
      [
        { text: "缺觸發條件", options: { fontSize: 10, bold: true } },
        { text: "「Creates documentation systems」", options: { fontFace: "Consolas", fontSize: 9 } },
        { text: "沒說何時該用", options: { fontSize: 10 } }
      ],
      [
        { text: "太技術化", options: { fontSize: 10, bold: true } },
        { text: "「Implements entity model...」", options: { fontFace: "Consolas", fontSize: 9 } },
        { text: "用戶不會這樣說話", options: { fontSize: 10 } }
      ]
    ], {
      x: 0.95, y: 3.4, w: 8.1, h: 1.2,
      border: { pt: 0.5, color: C.lightGray },
      colW: [1.8, 3.3, 3.0]
    });

    // Principle
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y: 4.95, w: 8.6, h: 0.45,
      fill: { color: C.teal }
    });
    slide.addText("核心原則：使用者怎麼說，description 就怎麼寫", {
      x: 0.7, y: 4.95, w: 8.6, h: 0.45,
      fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
    });
  }

  // ========================
  // SLIDE 11: Writing Instructions
  // ========================
  {
    let slide = addContentSlide(pres, "撰寫 SKILL.md 指令的最佳實踐");

    const practices = [
      {
        title: "具體且可操作",
        good: "Run python scripts/validate.py\n--input {filename}",
        bad: "Validate the data before\nproceeding",
        color: C.teal
      },
      {
        title: "善用漸進式揭露",
        good: "核心指令放 SKILL.md\n詳細文件移 references/",
        bad: "所有內容擠在\nSKILL.md 裡",
        color: C.tealLight
      },
      {
        title: "包含錯誤處理與範例",
        good: "MCP 連線失敗時：\n1. 確認服器狀態...",
        bad: "（沒有錯誤處理）",
        color: C.warmAccent
      }
    ];

    practices.forEach((p, i) => {
      const y = 1.15 + i * 1.35;
      addCard(slide, pres, 0.7, y, 8.6, 1.15, p.color);
      slide.addText(p.title, {
        x: 0.95, y: y + 0.08, w: 2.5, h: 0.3,
        fontSize: 13, bold: true, color: p.color, margin: 0
      });
      // Good
      slide.addText("✅", { x: 3.5, y: y + 0.08, w: 0.3, h: 0.25, fontSize: 11, margin: 0 });
      slide.addText(p.good, {
        x: 3.8, y: y + 0.08, w: 2.5, h: 0.95,
        fontFace: "Consolas", fontSize: 9, color: C.green, margin: 0
      });
      // Bad
      slide.addText("❌", { x: 6.5, y: y + 0.08, w: 0.3, h: 0.25, fontSize: 11, margin: 0 });
      slide.addText(p.bad, {
        x: 6.8, y: y + 0.08, w: 2.3, h: 0.95,
        fontFace: "Consolas", fontSize: 9, color: C.red, margin: 0
      });
    });

    // Bottom tip
    addCard(slide, pres, 0.7, 4.6, 8.6, 0.7, C.warmAccent);
    slide.addText([
      { text: "進階技巧：", options: { fontSize: 11, bold: true, color: C.warmAccent } },
      { text: "用腳本做確定性驗證，而非語言指令。程式碼是確定性的，語言解讀不是。", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 0.95, y: 4.7, w: 8.1, h: 0.45, margin: 0 });
  }

  // ========================
  // SLIDE 12: Success Criteria
  // ========================
  {
    let slide = addContentSlide(pres, "定義成功標準");

    // Quantitative
    addCard(slide, pres, 0.7, 1.15, 4.2, 2.4, C.teal);
    slide.addText(" 量化指標", {
      x: 0.95, y: 1.25, w: 3.8, h: 0.3,
      fontSize: 14, bold: true, color: C.teal, margin: 0
    });

    // Big numbers
    const metrics = [
      { num: "90%", label: "相關查詢觸發率" },
      { num: "X", label: "工具呼叫內完成" },
      { num: "0", label: "失敗的 API 呼叫" }
    ];
    metrics.forEach((m, i) => {
      const y = 1.7 + i * 0.55;
      slide.addText(m.num, {
        x: 1.1, y: y, w: 0.8, h: 0.4,
        fontSize: 22, bold: true, color: C.teal, align: "center", margin: 0
      });
      slide.addText(m.label, {
        x: 2.0, y: y + 0.05, w: 2.5, h: 0.35,
        fontSize: 11, color: C.bodyText, margin: 0
      });
    });

    // Qualitative
    addCard(slide, pres, 5.2, 1.15, 4.2, 2.4, C.warmAccent);
    slide.addText("質化指標", {
      x: 5.45, y: 1.25, w: 3.8, h: 0.3,
      fontSize: 14, bold: true, color: C.warmAccent, margin: 0
    });
    slide.addText([
      { text: "用戶不需提示下一步", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "工作流程無需修正即完成", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "各工作階段結果一致", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "新用戶能否首次就完成？", options: { bullet: true, fontSize: 11, color: C.bodyText } }
    ], { x: 5.45, y: 1.7, w: 3.8, h: 1.5, margin: 0 });

    // Performance comparison
    addCard(slide, pres, 0.7, 3.85, 8.6, 1.5, C.teal);
    slide.addText("效能對比範例（文件提供的參考基準）", {
      x: 0.95, y: 3.95, w: 8, h: 0.3,
      fontSize: 12, bold: true, color: C.teal, margin: 0
    });

    slide.addTable([
      [
        { text: "", options: { fill: { color: C.teal }, fontSize: 10 } },
        { text: "Without Skill", options: { bold: true, color: C.white, fill: { color: C.red }, fontSize: 10, align: "center" } },
        { text: "With Skill", options: { bold: true, color: C.white, fill: { color: C.green }, fontSize: 10, align: "center" } }
      ],
      [
        { text: "來回對話", options: { fontSize: 10, bold: true } },
        { text: "15 次", options: { fontSize: 10, align: "center" } },
        { text: "2 個澄清問題", options: { fontSize: 10, align: "center" } }
      ],
      [
        { text: "失敗 API 呼叫", options: { fontSize: 10, bold: true } },
        { text: "3 次", options: { fontSize: 10, align: "center" } },
        { text: "0 次", options: { fontSize: 10, align: "center" } }
      ],
      [
        { text: "Token 消耗", options: { fontSize: 10, bold: true } },
        { text: "12,000", options: { fontSize: 10, align: "center" } },
        { text: "6,000", options: { fontSize: 10, align: "center" } }
      ]
    ], {
      x: 0.95, y: 4.3, w: 8.1, h: 1.0,
      border: { pt: 0.5, color: C.lightGray },
      colW: [2.0, 3.05, 3.05]
    });
  }

  // ========================
  // SLIDE 13: Three Testing Dimensions
  // ========================
  {
    let slide = addContentSlide(pres, "測試的三個面向");

    const tests = [
      {
        title: "1. 觸發測試",
        desc: "Skill 是否在正確時機載入？",
        items: "✅ 明確任務觸發\n✅ 改述請求也觸發\n❌ 無關主題不觸發",
        color: C.teal
      },
      {
        title: "2. 功能測試",
        desc: "輸出正確？API 成功？錯誤處理？",
        items: "驗證輸出結果\n確認 API 呼叫成功\n測試邊界情況",
        color: C.tealLight
      },
      {
        title: "3. 效能比較",
        desc: "證明 Skill 確實改善了結果",
        items: "對比訊息來回次數\n比較失敗呼叫數量\n比較 Token 消耗",
        color: C.warmAccent
      }
    ];

    tests.forEach((t, i) => {
      const x = 0.7 + i * 3.1;
      addCard(slide, pres, x, 1.15, 2.85, 2.7, t.color);
      slide.addText(t.title, {
        x: x + 0.2, y: 1.25, w: 2.5, h: 0.3,
        fontSize: 13, bold: true, color: t.color, margin: 0
      });
      slide.addText(t.desc, {
        x: x + 0.2, y: 1.6, w: 2.5, h: 0.4,
        fontSize: 10, color: C.bodyText, margin: 0
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.2, y: 2.05, w: 2.3, h: 0.02, fill: { color: C.lightGray }
      });
      slide.addText(t.items, {
        x: x + 0.2, y: 2.15, w: 2.5, h: 1.5,
        fontSize: 10, color: C.darkText, margin: 0
      });
    });

    // Testing methods
    addCard(slide, pres, 0.7, 4.15, 8.6, 1.1, C.teal);
    slide.addText("測試方法", { x: 0.95, y: 4.25, w: 8, h: 0.3, fontSize: 13, bold: true, color: C.teal, margin: 0 });

    const methods = [
      { name: "手動測試", desc: "Claude.ai 上直接跑" },
      { name: "腳本測試", desc: "Claude Code 自動化" },
      { name: "程式化測試", desc: "Skills API 評估套件" }
    ];
    methods.forEach((m, i) => {
      const x = 0.95 + i * 2.9;
      slide.addText(m.name, { x: x, y: 4.6, w: 2.5, h: 0.2, fontSize: 11, bold: true, color: C.darkText, margin: 0 });
      slide.addText(m.desc, { x: x, y: 4.8, w: 2.5, h: 0.2, fontSize: 10, color: C.midGray, margin: 0 });
    });
  }

  // ========================
  // SLIDE 14: Skill-Creator & Iteration
  // ========================
  {
    let slide = addContentSlide(pres, "Skill-Creator 與迭代改進");

    // Left: skill-creator
    addCard(slide, pres, 0.7, 1.15, 4.2, 2.2, C.teal);
    slide.addText("Skill-Creator 工具", {
      x: 0.95, y: 1.25, w: 3.8, h: 0.3,
      fontSize: 14, bold: true, color: C.teal, margin: 0
    });
    slide.addText([
      { text: "從自然語言描述生成 Skill", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "產生正確格式的 SKILL.md", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "審查並建議改善", options: { bullet: true, fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "使用：", options: { fontSize: 11, bold: true, color: C.darkText, breakLine: true } },
      { text: "「Use skill-creator to help me\nbuild a skill for [用途]」", options: { fontFace: "Consolas", fontSize: 10, color: C.teal } }
    ], { x: 0.95, y: 1.65, w: 3.8, h: 1.5, margin: 0 });

    // Right: iteration signals
    addCard(slide, pres, 5.2, 1.15, 4.2, 2.2, C.warmAccent);
    slide.addText("迭代信號與對策", {
      x: 5.45, y: 1.25, w: 3.8, h: 0.3,
      fontSize: 14, bold: true, color: C.warmAccent, margin: 0
    });

    const signals = [
      { signal: "觸發不足", fix: "加更多觸發詞/技術用語", color: C.coral },
      { signal: "觸發過度", fix: "加負面觸發條件/縮小範圍", color: C.red },
      { signal: "執行不一致", fix: "改善指令精確度/錯誤處理", color: C.warmAccent }
    ];
    signals.forEach((s, i) => {
      const y = 1.7 + i * 0.5;
      slide.addText(s.signal, {
        x: 5.45, y: y, w: 1.5, h: 0.3,
        fontSize: 11, bold: true, color: s.color, margin: 0
      });
      slide.addText(s.fix, {
        x: 7.0, y: y, w: 2.3, h: 0.3,
        fontSize: 10, color: C.bodyText, margin: 0
      });
    });

    // Bottom: emphasis
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y: 3.65, w: 8.6, h: 0.5,
      fill: { color: C.teal }
    });
    slide.addText("Skills 是活文件，透過測試和使用者回饋不斷迭代改善", {
      x: 0.7, y: 3.65, w: 8.6, h: 0.5,
      fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
    });

    // Pro tip
    addCard(slide, pres, 0.7, 4.4, 8.6, 0.85, C.tealLight);
    slide.addText([
      { text: "Pro Tip：", options: { fontSize: 12, bold: true, color: C.tealLight } },
      { text: "先針對單一困難任務不斷迭代直到成功，再把成功的方法萃取成 Skill，而不是一開始就做廣泛測試。", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 0.95, y: 4.5, w: 8.1, h: 0.6, margin: 0 });
  }

  // ========================
  // SLIDE 15: Distribution
  // ========================
  {
    let slide = addContentSlide(pres, "發布與分享");

    // Three distribution levels
    const levels = [
      { title: "個人", desc: "下載資料夾 → 壓縮 → 上傳 Claude.ai\n或放入 Claude Code 目錄", color: C.teal },
      { title: "組織", desc: "管理員在工作區部署\n自動更新、集中管理", color: C.tealLight },
      { title: "API", desc: "/v1/skills 端點\nMessages API 整合\nAgent SDK 支援", color: C.warmAccent }
    ];

    levels.forEach((l, i) => {
      const x = 0.7 + i * 3.1;
      addCard(slide, pres, x, 1.15, 2.85, 2.0, l.color);
      slide.addText(l.title, {
        x: x + 0.2, y: 1.25, w: 2.5, h: 0.35,
        fontSize: 15, bold: true, color: l.color, margin: 0
      });
      slide.addText(l.desc, {
        x: x + 0.2, y: 1.7, w: 2.5, h: 1.2,
        fontSize: 11, color: C.bodyText, margin: 0
      });
    });

    // Open standard
    addCard(slide, pres, 0.7, 3.45, 8.6, 0.7, C.teal);
    slide.addText([
      { text: "開放標準：", options: { fontSize: 12, bold: true, color: C.teal } },
      { text: "如同 MCP，Skill 可跨工具和平台使用", options: { fontSize: 12, color: C.bodyText } }
    ], { x: 0.95, y: 3.55, w: 8.1, h: 0.45, margin: 0 });

    // Positioning principle
    addCard(slide, pres, 0.7, 4.4, 8.6, 0.85, C.warmAccent);
    slide.addText("定位原則：聚焦成果而非功能", {
      x: 0.95, y: 4.5, w: 8, h: 0.25,
      fontSize: 12, bold: true, color: C.warmAccent, margin: 0
    });
    slide.addText([
      { text: "✅ 「幾秒內建立完整工作區，取代 30 分鐘手動設定」", options: { fontSize: 10, color: C.green, breakLine: true } },
      { text: "❌ 「包含 YAML frontmatter 和 Markdown 指令的資料夾」", options: { fontSize: 10, color: C.red } }
    ], { x: 0.95, y: 4.75, w: 8.1, h: 0.45, margin: 0 });
  }

  // ========================
  // SLIDE 16: Problem-first vs Tool-first
  // ========================
  {
    let slide = addContentSlide(pres, "設計模式框架：Problem-first vs. Tool-first");

    // Home Depot analogy
    addCard(slide, pres, 0.7, 1.15, 8.6, 1.2, C.warmAccent);
    slide.addText([
      { text: "Home Depot 比喻", options: { fontSize: 13, bold: true, color: C.warmAccent, breakLine: true } },
      { text: "（類似台灣的特力屋）你可能帶著問題進去，「我要修廚房櫃樜」；或者拿起一把新電鑽，問怎麼用它。", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 0.95, y: 1.25, w: 8.1, h: 1.0, margin: 0 });

    // Two approaches
    addCard(slide, pres, 0.7, 2.6, 4.2, 2.3, C.teal);
    slide.addText("Problem-first", {
      x: 0.95, y: 2.7, w: 3.8, h: 0.35,
      fontSize: 16, bold: true, color: C.teal, margin: 0
    });
    slide.addText([
      { text: "用戶描述想要的結果", options: { fontSize: 12, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "「幫我建立一個專案工作區」", options: { fontSize: 11, italic: true, color: C.teal, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "Skill 負責編排正確的\nMCP 呼叫順序", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 0.95, y: 3.1, w: 3.8, h: 1.6, margin: 0 });

    addCard(slide, pres, 5.2, 2.6, 4.2, 2.3, C.coral);
    slide.addText("Tool-first", {
      x: 5.45, y: 2.7, w: 3.8, h: 0.35,
      fontSize: 16, bold: true, color: C.coral, margin: 0
    });
    slide.addText([
      { text: "用戶已有 MCP 存取", options: { fontSize: 12, color: C.bodyText, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "「我連接了 Notion MCP」", options: { fontSize: 11, italic: true, color: C.coral, breakLine: true } },
      { text: "", options: { fontSize: 4, breakLine: true } },
      { text: "Skill 教導 Claude 最佳的\n工作流程和實踐", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 5.45, y: 3.1, w: 3.8, h: 1.6, margin: 0 });
  }

  // ========================
  // SLIDE 17: Patterns 1 & 2
  // ========================
  {
    let slide = addContentSlide(pres, "Pattern 1 & 2：循序式工作流程 & 多 MCP 協調");

    // Pattern 1
    addCard(slide, pres, 0.7, 1.15, 4.2, 2.2, C.teal);
    slide.addText("Pattern 1：循序式工作流程", {
      x: 0.95, y: 1.25, w: 3.8, h: 0.3,
      fontSize: 13, bold: true, color: C.teal, margin: 0
    });
    slide.addText("特定順序的多步驟流程", {
      x: 0.95, y: 1.6, w: 3.8, h: 0.25,
      fontSize: 10, color: C.midGray, margin: 0
    });

    // Flow diagram
    const p1Steps = ["建帳號", "設定付款", "建訂閱", "發歡迎信"];
    p1Steps.forEach((s, i) => {
      const y = 1.95 + i * 0.35;
      slide.addShape(pres.shapes.RECTANGLE, { x: 1.2, y: y, w: 0.25, h: 0.25, fill: { color: C.teal } });
      slide.addText(`${i + 1}`, { x: 1.2, y: y, w: 0.25, h: 0.25, fontSize: 9, color: C.white, align: "center", valign: "middle", margin: 0 });
      slide.addText(s, { x: 1.55, y: y, w: 2.5, h: 0.25, fontSize: 10, color: C.darkText, margin: 0 });
    });

    // Pattern 2
    addCard(slide, pres, 5.2, 1.15, 4.2, 2.2, C.coral);
    slide.addText("Pattern 2：多 MCP 協調", {
      x: 5.45, y: 1.25, w: 3.8, h: 0.3,
      fontSize: 13, bold: true, color: C.coral, margin: 0
    });
    slide.addText("跨多個服務的流程", {
      x: 5.45, y: 1.6, w: 3.8, h: 0.25,
      fontSize: 10, color: C.midGray, margin: 0
    });

    const p2Phases = [
      { name: "Figma MCP", action: "匯出設計" },
      { name: "Drive MCP", action: "儲存資產" },
      { name: "Linear MCP", action: "建立任務" },
      { name: "Slack MCP", action: "發送通知" }
    ];
    p2Phases.forEach((p, i) => {
      const y = 1.95 + i * 0.35;
      slide.addShape(pres.shapes.RECTANGLE, { x: 5.7, y: y, w: 0.25, h: 0.25, fill: { color: C.coral } });
      slide.addText(`${i + 1}`, { x: 5.7, y: y, w: 0.25, h: 0.25, fontSize: 9, color: C.white, align: "center", valign: "middle", margin: 0 });
      slide.addText(`${p.name} → ${p.action}`, { x: 6.05, y: y, w: 3.1, h: 0.25, fontSize: 10, color: C.darkText, margin: 0 });
    });

    // Key techniques bottom
    addCard(slide, pres, 0.7, 3.65, 4.2, 1.3, C.teal);
    slide.addText("Pattern 1 關鍵技巧", { x: 0.95, y: 3.75, w: 3.8, h: 0.25, fontSize: 11, bold: true, color: C.teal, margin: 0 });
    slide.addText([
      { text: "明確的步驟順序與相依性", options: { bullet: true, fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "每階段驗證 + 失敗時回滾", options: { bullet: true, fontSize: 10, color: C.bodyText } }
    ], { x: 0.95, y: 4.05, w: 3.8, h: 0.7, margin: 0 });

    addCard(slide, pres, 5.2, 3.65, 4.2, 1.3, C.coral);
    slide.addText("Pattern 2 關鍵技巧", { x: 5.45, y: 3.75, w: 3.8, h: 0.25, fontSize: 11, bold: true, color: C.coral, margin: 0 });
    slide.addText([
      { text: "清楚的階段分離", options: { bullet: true, fontSize: 10, color: C.bodyText, breakLine: true } },
      { text: "MCP 之間的資料傳遞", options: { bullet: true, fontSize: 10, color: C.bodyText } }
    ], { x: 5.45, y: 4.05, w: 3.8, h: 0.7, margin: 0 });
  }

  // ========================
  // SLIDE 18: Patterns 3, 4, 5
  // ========================
  {
    let slide = addContentSlide(pres, "Pattern 3-5：迭代精煉 / 上下文感知 / 領域智慧");

    const patterns = [
      {
        title: "Pattern 3\n迭代精煉",
        desc: "輸出品質因反複修改而改善",
        example: "範例：報告生成",
        keys: "明確品質標準\n知道何時停止迭代",
        color: C.teal
      },
      {
        title: "Pattern 4\n上下文感知選擇",
        desc: "相同目標，依情境選不同工具",
        example: "範例：檔案儲存",
        keys: "清楚的決策樹\n透明的選擇說明",
        color: C.tealLight
      },
      {
        title: "Pattern 5\n領域專業智慧",
        desc: "嵌入超越工具存取的專業知識",
        example: "範例：付款合規檢查",
        keys: "領域專業嵌入邏輯\n合規優先於執行",
        color: C.warmAccent
      }
    ];

    patterns.forEach((p, i) => {
      const x = 0.7 + i * 3.1;
      addCard(slide, pres, x, 1.15, 2.85, 3.8, p.color);

      slide.addText(p.title, {
        x: x + 0.2, y: 1.3, w: 2.5, h: 0.6,
        fontSize: 13, bold: true, color: p.color, margin: 0
      });
      slide.addText(p.desc, {
        x: x + 0.2, y: 2.0, w: 2.5, h: 0.5,
        fontSize: 10, color: C.bodyText, margin: 0
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.2, y: 2.55, w: 2.3, h: 0.02, fill: { color: C.lightGray }
      });
      slide.addText(p.example, {
        x: x + 0.2, y: 2.65, w: 2.5, h: 0.3,
        fontSize: 10, color: p.color, bold: true, margin: 0
      });
      slide.addText("關鍵技巧：", {
        x: x + 0.2, y: 3.0, w: 2.5, h: 0.25,
        fontSize: 10, bold: true, color: C.darkText, margin: 0
      });
      slide.addText(p.keys, {
        x: x + 0.2, y: 3.3, w: 2.5, h: 0.8,
        fontSize: 10, color: C.bodyText, margin: 0
      });
    });
  }

  // ========================
  // SLIDE 19: Troubleshooting
  // ========================
  {
    let slide = addContentSlide(pres, "常見問題排除");

    const issues = [
      {
        title: "上傳失敗",
        fixes: "SKILL.md 拼寫不對（大小寫敏感）\nYAML 缺少 --- 分隔符號\n名稱沒用 kebab-case",
        color: C.red
      },
      {
        title: "觸發問題",
        fixes: "不足 → 加觸發詞到 description\n過度 → 加負面觸發、縮小範圍\n除錯：問 Claude 「When would you use [skill]?」",
        color: C.coral
      },
      {
        title: "指令未遵循",
        fixes: "太冗長 → 精簡、條列式\n關鍵指令被埋 → 放最上方\n語言模糊 → 用腳本驗證",
        color: C.warmAccent
      },
      {
        title: "效能問題",
        fixes: "SKILL.md < 5,000 字\n詳細文件移 references/\n避免同時啟用 >20 個 Skill",
        color: C.tealLight
      }
    ];

    issues.forEach((iss, i) => {
      const isLeft = i % 2 === 0;
      const x = isLeft ? 0.7 : 5.2;
      const y = 1.15 + Math.floor(i / 2) * 2.05;
      addCard(slide, pres, x, y, 4.2, 1.8, iss.color);
      slide.addText(iss.title, {
        x: x + 0.2, y: y + 0.1, w: 3.8, h: 0.3,
        fontSize: 13, bold: true, color: iss.color, margin: 0
      });
      slide.addText(iss.fixes, {
        x: x + 0.2, y: y + 0.45, w: 3.8, h: 1.2,
        fontSize: 10, color: C.bodyText, margin: 0
      });
    });
  }

  // ========================
  // SLIDE 20: Quick Checklist
  // ========================
  {
    let slide = addContentSlide(pres, "Quick Checklist & 資源");

    // Checklist phases
    const phases = [
      {
        phase: "開始前",
        items: "辨識 2-3 使用案例\n規劃資料夾結構",
        color: C.teal
      },
      {
        phase: "開發中",
        items: "kebab-case 命名\nSKILL.md + 正確 YAML\n指令清楚可操作",
        color: C.tealLight
      },
      {
        phase: "上傳前",
        items: "觸發 + 功能測試通過\n壓縮為 .zip",
        color: C.warmAccent
      },
      {
        phase: "上傳後",
        items: "真實對話測試\n監控觸發、收集回饋\n持續迭代",
        color: C.coral
      }
    ];

    phases.forEach((p, i) => {
      const x = 0.7 + i * 2.2;
      addCard(slide, pres, x, 1.15, 2.0, 2.2, p.color);
      slide.addText(p.phase, {
        x: x + 0.2, y: 1.25, w: 1.65, h: 0.3,
        fontSize: 13, bold: true, color: p.color, margin: 0
      });
      slide.addText(p.items, {
        x: x + 0.2, y: 1.65, w: 1.65, h: 1.5,
        fontSize: 10, color: C.bodyText, margin: 0
      });
    });

    // Resources
    addCard(slide, pres, 0.7, 3.65, 8.6, 1.55, C.teal);
    slide.addText("資源", {
      x: 0.95, y: 3.75, w: 8, h: 0.3,
      fontSize: 14, bold: true, color: C.teal, margin: 0
    });
    slide.addText([
      { text: "skill-creator：", options: { fontSize: 11, bold: true, color: C.darkText } },
      { text: "內建工具，快速生成和審查 Skill", options: { fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "github.com/anthropics/skills：", options: { fontSize: 11, bold: true, color: C.darkText } },
      { text: "公開範例倉庫", options: { fontSize: 11, color: C.bodyText, breakLine: true } },
      { text: "支援：", options: { fontSize: 11, bold: true, color: C.darkText } },
      { text: "Claude Developers Discord / GitHub Issues", options: { fontSize: 11, color: C.bodyText } }
    ], { x: 0.95, y: 4.1, w: 8.1, h: 0.9, margin: 0 });
  }

  // ========================
  // SLIDE 21: Conclusion
  // ========================
  {
    let slide = pres.addSlide();
    slide.background = { color: C.darkBg };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });

    slide.addText("結論", {
      x: 0.8, y: 0.4, w: 8, h: 0.6,
      fontSize: 32, fontFace: "Georgia", color: C.white, bold: true, margin: 0
    });

    const conclusions = [
      { text: "Skill 將「一次性的提示工程」封裝成「可重複使用的知識資產」", color: C.mint },
      { text: "三層漸進式揭露：平衡 Token 效率與專業深度", color: C.tealLight },
      { text: "MCP + Skills = 連接能力 + 工作流程知識 → 完整的 AI 解決方案", color: C.mint },
      { text: "Description 是成敗關鍵 — 決定 Skill 何時被觸發", color: C.warmAccent },
      { text: "持續迭代：Skill 是活文件，透過測試與回饋不斷改善", color: C.green }
    ];

    conclusions.forEach((c, i) => {
      const y = 1.3 + i * 0.6;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.8, y: y + 0.05, w: 0.06, h: 0.35, fill: { color: c.color }
      });
      slide.addText(c.text, {
        x: 1.1, y: y, w: 8, h: 0.5,
        fontSize: 14, color: c.color, margin: 0
      });
    });

    // Call to action
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 4.3, w: 8.4, h: 0.8,
      fill: { color: C.teal }
    });
    slide.addText("從今天開始：用 skill-creator 花 15-30 分鐘建立你的第一個 Skill", {
      x: 0.8, y: 4.3, w: 8.4, h: 0.8,
      fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
    });
  }

  // ========================
  // SLIDE 22: Thanks
  // ========================
  {
    let slide = pres.addSlide();
    slide.background = { color: C.darkBg };
    // Decorative
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.teal } });
    slide.addShape("ellipse", { x: 7.5, y: 1.0, w: 1.5, h: 1.5, fill: { color: C.teal, transparency: 70 } });
    slide.addShape("ellipse", { x: 8.3, y: 2.5, w: 1.0, h: 1.0, fill: { color: C.mint, transparency: 70 } });

    slide.addText("Thanks for Listening", {
      x: 0.8, y: 1.5, w: 7, h: 1.2,
      fontSize: 40, fontFace: "Georgia", color: C.white, bold: true, margin: 0
    });
    slide.addText("有什麼問題歡迎提問", {
      x: 0.8, y: 2.8, w: 7, h: 0.5,
      fontSize: 16, color: C.tealLight, margin: 0
    });

    // Accent line under subtitle
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.45, w: 2, h: 0.04, fill: { color: C.teal } });
  }

  // ========================
  // WRITE FILE
  // ========================
  await pres.writeFile({ fileName: "doc/skills.pptx" });
  console.log("Presentation created: doc/skills.pptx");
}

createPresentation().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
