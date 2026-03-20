# 講稿：從提示工程到技能封裝 — 探索 Claude Skills 的架構與應用

> 預估總時間：約 30 分鐘

---

## Slide 1：封面（不講述，等待開場）

---

## Slide 2：Outline（~1 分鐘）

各位好，我是 Frank。今天要跟大家介紹的是 Claude Skills — 一個讓 Claude 能夠學習並重複執行特定工作流程的機制。

今天的報告會分成五個部分：首先介紹 Skill 是什麼以及它的核心設計原則；接著談 Skills 與 MCP 的關係；然後進入規劃與設計的實務面，包含使用案例和 YAML 的寫法；再來是測試與迭代的方法論；最後談發布方式和五大設計模式。

---

## Slide 3：什麼是 Skill？（~2 分鐘）

那麼 Skill 到底是什麼？簡單來說，Skill 就是一組打包成資料夾的指令集，用來教導 Claude 處理特定的任務或工作流程。

過去我們跟 Claude 對話時，每次都需要重新解釋偏好、流程和專業知識。Skill 解決了這個問題 — 你教 Claude 一次，之後每次對話它都能自動套用。

Skill 特別適合可重複的工作流程。例如從規格文件生成前端設計、以一致的方法進行研究、建立遵循團隊風格指南的文件，或是協調多步驟的流程。

這份指南提供了兩條學習路徑：如果你是獨立開發 Skill，可以聚焦在基礎篇和規劃設計的 Category 1 跟 2；如果你是要替現有的 MCP 伺服器增強功能，那就特別關注 Skills + MCP 的段落和 Category 3。

---

## Slide 4：漸進式揭露（~2 分鐘）

Skill 最重要的設計原則是「漸進式揭露」，英文叫 Progressive Disclosure。

大家可以看到投影片上有一個三層的圖示。第一層是 YAML Frontmatter，這部分永遠會被載入到 Claude 的系統提示中，它提供了 Claude 判斷「什麼時候該使用這個 Skill」的資訊。第二層是 SKILL.md 的主體內容，只有在 Claude 判斷這個 Skill 跟當前任務相關時才會載入，裡面包含完整的指令和引導。第三層是 references 目錄裡的連結檔案，Claude 會在需要時才去探索和讀取。

這個設計的核心效益是：最小化 Token 使用量，同時保持專業能力。只在需要時載入需要的資訊。

另外還有兩個設計原則：可組合性 — 多個 Skill 可以同時協同運作；以及可攜性 — 同一個 Skill 在 Claude.ai、Claude Code 和 API 上的運作完全一致。

---

## Slide 5：Skills + MCP 廚房比喻（~3 分鐘）

接下來要談 Skills 和 MCP 的關係。Anthropic 的文件中用了一個很直覺的比喻：廚房比喻。

左邊是 MCP，它就像一間專業廚房。負責連接 Claude 到你的服務，像是 Notion、Linear 這些工具。它提供即時的資料存取和工具調用能力。MCP 回答的核心問題是：Claude **能做**什麼？

右邊是 Skills，就像是食譜。教導 Claude 如何有效地使用這些服務，捕捉工作流程和最佳實踐。Skills 回答的核心問題是：Claude **該怎麼做**？

下半部的對比很重要：光有廚房但沒有食譜會怎樣？使用者連接了 MCP 但不知道下一步做什麼，每次對話都得從零開始，結果不一致，用戶反而歸咎於連接器本身。加上 Skills 之後，預建的工作流程會自動啟動，工具使用變得一致可靠，大幅降低整合的學習曲線。

所以對 MCP 開發者來說，提供 Skills 能讓你的整合方案比只有 MCP 的競爭者更有價值。

---

## Slide 6：Category 1 — 文件與資產建立（~1.5 分鐘）

Anthropic 在實務中觀察到三大常見的使用案例類別。先看 Category 1。

「文件與資產建立」是用來建立一致、高品質的輸出，包括文件、簡報和程式碼。

下方四個卡片是關鍵技巧：嵌入風格指南確保品牌一致、使用範本結構確保輸出格式統一、加入品質檢查清單在完成前做最後確認，而且這一類不需要外部工具，完全使用 Claude 的內建能力。

---

## Slide 7：Category 2 & 3 — 工作流程自動化 & MCP 增強（~2.5 分鐘）

左邊是 Category 2「工作流程自動化」。適合需要一致方法論的多步驟流程。範例是 skill-creator 本身 — 它帶你走過逐步工作流程，每個步驟都有驗證關卡，還會迭代精煉。

右邊是 Category 3「MCP 增強」。為 MCP 伺服器提供的工具存取加上工作流程引導。範例是 Sentry 的 sentry-code-review skill。這一類的關鍵技巧包括多 MCP 協調、領域知識嵌入和完善的錯誤處理。

下面有一個 Sprint Planning 的流程圖範例，展示了從觸發詞「help me plan this sprint」開始，經過取得專案狀態、分析產能、建議優先順序、建立任務，最終產出完整的 Sprint 計畫。這就是一個很典型的 Skill 使用案例。

---

## Slide 8：檔案結構與命名規則（~1.5 分鐘）

來看技術面。左邊是 Skill 的資料夾結構，很簡單：必要的 SKILL.md，加上選用的 scripts、references 和 assets 目錄。

右邊是幾個關鍵規則：SKILL.md 是大小寫敏感的，只接受這個拼法。資料夾名稱必須用 kebab-case，像 notion-project-setup 打勾，有空格或底線的都不行。不要在 Skill 資料夾內放 README.md，文件應該放在 SKILL.md 或 references/ 目錄裡。

下方是安全限制：frontmatter 中禁止使用 XML 角括號，因為它會出現在 Claude 的系統提示中，惡意內容可能注入指令。另外 Skill 名稱不能包含 "claude" 或 "anthropic"。

---

## Slide 9：YAML Frontmatter（~1.5 分鐘）

YAML Frontmatter 只需要兩個必要欄位：name 和 description。左邊是最小格式，就是三個破折號包住 name 和 description。

右邊列出了選用欄位：license 用於開源、compatibility 描述環境需求、allowed-tools 可以限制工具存取、metadata 放作者和版本等自訂資訊。

下方的表格整理了欄位要求：name 要 kebab-case，description 必須同時包含「做什麼」和「何時使用」，上限 1024 字元，禁止 XML 標籤。

---

## Slide 10：Description 好壞範例（~2 分鐘）

Description 是決定 Skill 成敗的關鍵，因為它就是漸進式揭露的第一層 — Claude 靠它來判斷何時載入你的 Skill。

上方綠色區塊是好的 Description：具體說明「做什麼」、包含「何時使用」的觸發詞、提及相關的檔案類型。範例是 "Manages Linear workflows including sprint planning. Use when user mentions sprint, Linear tasks, or project planning."

下方紅色表格是三種常見的錯誤：太模糊的 "Helps with projects"，Claude 幾乎不會觸發。缺少觸發條件的 "Creates documentation systems"。太技術化的 "Implements entity model"，使用者根本不會這樣說話。

最下面那條醒目的橫幅就是核心原則：使用者怎麼說，description 就怎麼寫。

---

## Slide 11：撰寫指令的最佳實踐（~2 分鐘）

SKILL.md 的指令撰寫有三個重要原則，每個都有好壞範例對比。

第一，要具體且可操作。好的寫法像是「Run python scripts/validate.py --input {filename}」，壞的寫法是模糊的「Validate the data before proceeding」。

第二，善用漸進式揭露。核心指令放在 SKILL.md，詳細的參考文件移到 references 目錄。

第三，要包含錯誤處理和範例。像是列出「MCP 連線失敗時：1. 確認伺服器狀態...」這樣的具體步驟。

下方的進階技巧很重要：對於關鍵驗證，考慮打包一個腳本來做確定性驗證，而不是用語言指令。程式碼是確定性的，語言解讀不是。

---

## Slide 12：定義成功標準（~2 分鐘）

在測試之前，先定義什麼叫成功。左邊是量化指標，三個大數字很清楚：90% 的觸發率、X 次工具呼叫內完成、0 次失敗的 API 呼叫。

右邊是質化指標：使用者不需要提示下一步、工作流程無需修正即完成、結果在各階段一致、新使用者能否首次就完成。

下方的表格是效能對比範例。這是文件提供的參考基準：沒有 Skill 時需要 15 次來回、3 次失敗、12,000 tokens；有了 Skill 之後只有 2 個澄清問題、0 次失敗、6,000 tokens。當然文件也坦承，這些目前還是粗略的基準。

---

## Slide 13：測試的三個面向（~2 分鐘）

建議的測試分三個面向，投影片上用三個並排的卡片呈現。

第一是觸發測試：確認 Skill 在正確的時機載入。明確任務應該觸發、改述的請求也應該觸發、無關主題不應該觸發。

第二是功能測試：驗證輸出正確、API 呼叫成功、錯誤處理正常、邊界情況被覆蓋。

第三是效能比較：對比來回次數、失敗呼叫數量和 Token 消耗。

下面列出三種測試方法：手動測試在 Claude.ai 上直接跑、腳本測試在 Claude Code 中自動化、程式化測試透過 Skills API 建構評估套件。

---

## Slide 14：Skill-Creator 與迭代改進（~2 分鐘）

左邊介紹 Skill-Creator 工具。Anthropic 內建了這個工具，在 Claude.ai 和 Claude Code 中都可以使用。它能從自然語言描述生成 Skill、產生正確格式的 SKILL.md、審查並建議改善。使用方式很直接，只要跟 Claude 說「Use skill-creator to help me build a skill for [你的用途]」就行了。

但要注意，skill-creator 協助你設計和精煉 Skill，它不會執行自動化測試套件。

右邊是三種迭代信號和對策：觸發不足時加更多觸發詞；觸發過度時加負面觸發條件或縮小範圍；執行不一致時改善指令精確度。

中間那條醒目的橫幅強調：Skills 是活文件，要持續迭代。

下方的 Pro Tip 很重要：先針對單一困難任務不斷迭代直到成功，再把成功的方法萃取成 Skill，而不是一開始就做廣泛測試。

---

## Slide 15：發布與分享（~1.5 分鐘）

發布 Skill 有三種層級，投影片用三個卡片呈現。

個人使用者可以下載資料夾、壓縮後上傳到 Claude.ai，或放入 Claude Code 的目錄。組織層級方面，管理員可以在工作區部署，支援自動更新和集中管理。API 方面提供 /v1/skills 端點、Messages API 整合以及 Agent SDK 支援。

中間提到 Anthropic 把 Agent Skills 發布為開放標準，跟 MCP 一樣可以跨工具和平台使用。

最下面是定位原則：聚焦成果而非功能。好的描述是「幾秒內建立完整工作區，取代 30 分鐘手動設定」，壞的是「包含 YAML frontmatter 和 Markdown 指令的資料夾」。

---

## Slide 16：Problem-first vs. Tool-first（~1.5 分鐘）

在進入五大模式之前，先理解一個框架。投影片上面用了 Home Depot 的比喻 — 類似台灣的特力屋。你可能帶著問題走進去，「我要修廚房櫥櫃」；或者你拿起一把新電鑽，問怎麼用。

左邊是 Problem-first：使用者描述想要的結果，像是「幫我建立一個專案工作區」，Skill 負責編排正確的 MCP 呼叫順序。

右邊是 Tool-first：使用者已經有 MCP 存取，像是「我連接了 Notion MCP」，Skill 教導 Claude 最佳的工作流程和實踐。

大多數 Skills 會偏向其中一邊，知道你的 Skill 是哪一種，有助於選擇正確的設計模式。

---

## Slide 17：Pattern 1 & 2（~2 分鐘）

左邊是 Pattern 1「循序式工作流程」— 適合特定順序的多步驟流程。範例是客戶上架：建帳號、設定付款、建訂閱、發歡迎信，每一步都依賴前一步。關鍵技巧是明確的步驟順序與相依性，以及每階段驗證加上失敗時的回滾。

右邊是 Pattern 2「多 MCP 協調」— 適合跨多個服務的流程。範例是設計到開發交接：從 Figma 匯出設計、存到 Drive、在 Linear 建任務、最後用 Slack 通知團隊。關鍵是清楚的階段分離和 MCP 之間的資料傳遞。

---

## Slide 18：Pattern 3-5（~2 分鐘）

剩下三個 Pattern 用三個並排卡片呈現。

Pattern 3「迭代精煉」— 適合輸出品質因反覆修改而改善的情境，像報告生成。關鍵是明確的品質標準和知道何時停止。

Pattern 4「上下文感知選擇」— 相同目標但依情境選不同工具。例如檔案儲存，大檔案用雲端、協作文件用 Notion、程式碼用 GitHub。關鍵是清楚的決策樹和透明的選擇說明。

Pattern 5「領域專業智慧」— 嵌入超越工具存取的專業知識。例如付款處理前的合規檢查。關鍵是領域專業嵌入邏輯，合規優先於執行。

---

## Slide 19：常見問題排除（~1.5 分鐘）

投影片用四個卡片整理了最常見的問題。

上傳失敗：SKILL.md 拼寫不對、YAML 缺分隔符號、名稱沒用 kebab-case。

觸發問題：不足就加觸發詞；過度就加負面觸發或縮小範圍。除錯方法是直接問 Claude "When would you use [skill name]?"

指令未遵循：太冗長就精簡、關鍵指令被埋就放最上方、語言模糊就用腳本驗證。

效能問題：SKILL.md 保持在 5,000 字以內、詳細文件移到 references、避免同時啟用超過 20 個 Skill。

---

## Slide 20：Quick Checklist & 資源（~1 分鐘）

最後是一個快速檢查清單，分成四個階段。

開始前：辨識 2 到 3 個使用案例，規劃資料夾結構。開發中：kebab-case 命名、SKILL.md 加上正確的 YAML、指令清楚可操作。上傳前：觸發和功能測試通過，壓縮為 zip。上傳後：真實對話測試、監控觸發、收集回饋、持續迭代。

下方是資源：skill-creator 是內建工具，可以快速生成和審查 Skill；github.com/anthropics/skills 是公開範例倉庫；技術支援可到 Claude Developers Discord 或 GitHub Issues。

---

## Slide 21：結論（~2 分鐘）

最後做一個總結。

今天我們看到，Skill 本質上是把「一次性的提示工程」封裝成「可重複使用的知識資產」。你不再需要每次對話都從頭解釋，而是把專業知識和工作流程打包一次，之後持續受益。

架構上，三層漸進式揭露巧妙地平衡了 Token 效率和專業深度 — 只在需要時載入需要的資訊。

從生態系的角度來看，MCP 提供連接能力，Skills 提供工作流程知識，兩者結合才是完整的 AI 解決方案。這也是為什麼 Anthropic 把 Skills 發布為開放標準的原因。

實務上有兩個關鍵要記住：第一，Description 是成敗的關鍵，它決定了你的 Skill 何時被觸發，寫不好就等於白做。第二，Skill 是活文件，要透過測試和使用者回饋不斷迭代改善。

如果你今天想帶走一件事，那就是：打開 Claude，用 skill-creator 花 15 到 30 分鐘建立你的第一個 Skill。從最常重複的工作流程開始，做了就會理解它的價值。

---

## Slide 22：Thanks for listening

以上就是今天的報告，謝謝大家。有什麼問題歡迎提問。
