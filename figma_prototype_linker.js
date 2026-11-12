/**
 * Figma Prototype Auto-Linker Script
 * 
 * Instructions:
 * 1. Open your Figma file containing the Check Before Deal screens (S01 - S41).
 * 2. In Figma Desktop, open the developer console (Plugins > Development > Open Console)
 *    OR use the "Scripter" plugin.
 * 3. Paste this entire script and press Enter / Run.
 * 
 * It will:
 * - Locate all screen frames (S01 to S41).
 * - Configure the 7 Flow Starting Points for usability tests (T1, T1b, T2, T3, T4, T4b, T5).
 * - Create prototype connections (reactions) matching the exact specification.
 * - Set the 3-second auto-advance on S03.
 * - Connect Root Tab Bar and Bell icons across all root screens.
 */

(async function linkFigmaPrototype() {
  console.log("🚀 Starting Figma Prototype Auto-Linker...");

  // 1. Locate all screen frames (search all frames including inside sections)
  const screenMap = {};
  const allFrames = figma.currentPage.findAll(n => n.type === 'FRAME' || n.type === 'COMPONENT');

  for (let i = 1; i <= 41; i++) {
    const sId = "S" + (i < 10 ? "0" + i : i);
    // Find frame matching S01, S01_..., s01, etc.
    const frame = allFrames.find(n => {
      const name = n.name.trim().toUpperCase();
      return name === sId || name.startsWith(sId + "_") || name.startsWith(sId + " ") || name.startsWith(sId + "-");
    });
    if (frame) {
      screenMap[sId] = frame;
    }
  }

  const foundCount = Object.keys(screenMap).length;
  console.log(`📍 Found ${foundCount}/41 screen frames in current page.`);
  if (foundCount === 0) {
    console.error("❌ No screen frames found! Please ensure your frames are named S01, S02, ... S41.");
    return;
  }

  // 2. Setup Flow Starting Points
  const flowSpecs = [
    { id: 'S01', name: 'T1 ตรวจคู่ค้า' },
    { id: 'S04', name: 'T1b ชื่อบัญชีไม่ตรง' },
    { id: 'S09', name: 'T2 มีของจริง' },
    { id: 'S01', name: 'T3 เบรกก่อนโอน' },
    { id: 'S22', name: 'T4 ยืนยันตัวตน' },
    { id: 'S22', name: 'T4b ยืนยันดีล+รีวิว' },
    { id: 'S33', name: 'T5 รายงาน' }
  ];

  const flows = [];
  for (const f of flowSpecs) {
    if (screenMap[f.id]) {
      flows.push({
        nodeId: screenMap[f.id].id,
        name: f.name
      });
    }
  }
  figma.currentPage.flowStartingPoints = flows;
  console.log(`✅ Configured ${flows.length} Flow Starting Points.`);

  // Helper to add interaction
  async function addLink(sourceNode, targetScreenId, triggerType = 'ON_CLICK', delaySeconds = 0) {
    const targetFrame = screenMap[targetScreenId];
    if (!sourceNode || !targetFrame) {
      if (!targetFrame) console.warn(`⚠️ Target frame ${targetScreenId} not found.`);
      return false;
    }

    const trigger = triggerType === 'AFTER_DELAY'
      ? { type: 'AFTER_DELAY', timeout: delaySeconds }
      : { type: 'ON_CLICK' };

    const reaction = {
      trigger: trigger,
      actions: [{
        type: 'NODE',
        destinationId: targetFrame.id,
        navigation: 'NAVIGATE',
        transition: {
          type: 'DISSOLVE',
          easing: { type: 'EASE_OUT' },
          duration: 0.2
        }
      }]
    };

    try {
      const existing = sourceNode.reactions ? [...sourceNode.reactions] : [];
      // Prevent duplicate exact target links
      const filtered = existing.filter(r => {
        const dest = r.actions && r.actions[0] && r.actions[0].destinationId;
        return dest !== targetFrame.id;
      });
      await sourceNode.setReactionsAsync([...filtered, reaction]);
      return true;
    } catch (e) {
      console.warn(`Failed to set reaction on ${sourceNode.name}:`, e);
      return false;
    }
  }

  // Helper to find child node by text or name
  function findChild(parent, predicate) {
    if (!parent) return null;
    let found = null;
    function walk(node) {
      if (found) return;
      if (node !== parent && predicate(node)) {
        found = node;
        return;
      }
      if ('children' in node) {
        for (const child of node.children) {
          walk(child);
          if (found) return;
        }
      }
    }
    walk(parent);
    return found;
  }

  function findByText(parent, keyword) {
    const kw = keyword.trim().toLowerCase();
    const textNode = findChild(parent, n => n.type === 'TEXT' && n.characters.toLowerCase().includes(kw));
    if (!textNode) return null;
    // Prefer interactive parent container if text is wrapped in button/frame
    let current = textNode;
    while (current.parent && current.parent !== parent && (current.parent.type === 'FRAME' || current.parent.type === 'COMPONENT' || current.parent.type === 'INSTANCE' || current.parent.type === 'GROUP')) {
      // If the parent is clearly a button or card, use it
      if (current.parent.name.toLowerCase().includes('btn') || current.parent.name.toLowerCase().includes('button') || current.parent.name.toLowerCase().includes('card') || current.parent.name.toLowerCase().includes('item')) {
        return current.parent;
      }
      current = current.parent;
    }
    return textNode;
  }

  function findByIconOrName(parent, nameKeyword) {
    const kw = nameKeyword.trim().toLowerCase();
    return findChild(parent, n => n.name.toLowerCase().includes(kw) || (n.type === 'TEXT' && n.characters.toLowerCase().includes(kw)));
  }

  // 3. Connect Root Tab Bar & Bell Icon
  const rootScreens = ['S01', 'S09', 'S22', 'S26', 'S27', 'S33'];
  for (const sId of rootScreens) {
    const frame = screenMap[sId];
    if (!frame) continue;

    const tabCheck = findByText(frame, 'เช็ก') || findByIconOrName(frame, 'tab_check');
    if (tabCheck) await addLink(tabCheck, 'S01');

    const tabChecklist = findByText(frame, 'เช็กลิสต์') || findByIconOrName(frame, 'tab_checklist');
    if (tabChecklist) await addLink(tabChecklist, 'S09');

    const tabProfile = findByText(frame, 'โปรไฟล์') || findByIconOrName(frame, 'tab_profile');
    if (tabProfile) await addLink(tabProfile, 'S22');

    const tabReport = findByText(frame, 'รายงาน') || findByIconOrName(frame, 'tab_report');
    if (tabReport) await addLink(tabReport, 'S33');

    const bellIcon = findByIconOrName(frame, 'notifications') || findByIconOrName(frame, 'bell');
    if (bellIcon) await addLink(bellIcon, 'S39');
  }

  // 4. Wire Individual Screens according to the map

  // S01
  const s01 = screenMap['S01'];
  if (s01) {
    const inputCard = findByText(s01, 'วางลิงก์') || findByText(s01, 'ตรวจคนขาย');
    if (inputCard) await addLink(inputCard, 'S02');
    const shareFb = findByText(s01, 'แชร์โพสต์จาก Facebook');
    if (shareFb) await addLink(shareFb, 'S02');
    const btnCheck = findByText(s01, 'ตรวจสอบ');
    if (btnCheck) await addLink(btnCheck, 'S03');

    const rowMin = findByText(s01, 'Min Sneaker Shop');
    if (rowMin) await addLink(rowMin, 'S04');
    const rowPim = findByText(s01, 'Pim Preloved');
    if (rowPim) await addLink(rowPim, 'S05');
    const rowKitti = findByText(s01, 'Kitti Used Gear');
    if (rowKitti) await addLink(rowKitti, 'S06');

    const tilePrice = findByText(s01, 'เช็กราคา');
    if (tilePrice) await addLink(tilePrice, 'S17');
    const tileChat = findByText(s01, 'ตรวจแชท');
    if (tileChat) await addLink(tileChat, 'S18');
    const tileBreak = findByText(s01, 'เบรกก่อนโอน');
    if (tileBreak) await addLink(tileBreak, 'S19');
  }

  // S02
  const s02 = screenMap['S02'];
  if (s02) {
    const btnCheck = findByText(s02, 'ตรวจสอบ');
    if (btnCheck) await addLink(btnCheck, 'S03');
    const btnClear = findByText(s02, 'ล้าง') || findByIconOrName(s02, 'clear');
    if (btnClear) await addLink(btnClear, 'S01');
  }

  // S03: auto-advance after 3 seconds -> S04; cancel -> S01
  const s03 = screenMap['S03'];
  if (s03) {
    await addLink(s03, 'S04', 'AFTER_DELAY', 3);
    const btnCancel = findByText(s03, 'ยกเลิกการตรวจ') || findByText(s03, 'ยกเลิก');
    if (btnCancel) await addLink(btnCancel, 'S01');
  }

  // S04
  const s04 = screenMap['S04'];
  if (s04) {
    const backBtn = findByIconOrName(s04, 'back') || findByIconOrName(s04, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S01');
    const sellerCard = findByText(s04, 'Min Sneaker Shop') || findByText(s04, 'ผู้ขาย');
    if (sellerCard) await addLink(sellerCard, 'S07');
    const r1 = findByText(s04, 'ถูกรายงาน 3 ครั้ง');
    if (r1) await addLink(r1, 'S08');
    const r2 = findByText(s04, 'ชื่อบัญชีไม่ตรง');
    if (r2) await addLink(r2, 'S07');
    const r3 = findByText(s04, 'บัญชีเพิ่งสร้าง');
    if (r3) await addLink(r3, 'S08');
    const toChecklist = findByText(s04, 'ไปเช็กลิสต์ก่อนโอน');
    if (toChecklist) await addLink(toChecklist, 'S10');
    const toReport = findByText(s04, 'รายงานผู้ขายคนนี้');
    if (toReport) await addLink(toReport, 'S33');
  }

  // S05
  const s05 = screenMap['S05'];
  if (s05) {
    const backBtn = findByIconOrName(s05, 'back') || findByIconOrName(s05, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S01');
    const reasonCard = findByText(s05, 'เหตุผล') || findByText(s05, 'รายงาน');
    if (reasonCard) await addLink(reasonCard, 'S08');
    const reqProof = findByText(s05, 'ขอ Proof Code จากคนขาย');
    if (reqProof) await addLink(reqProof, 'S12');
    const toChecklist = findByText(s05, 'ไปเช็กลิสต์ก่อนโอน');
    if (toChecklist) await addLink(toChecklist, 'S10');
  }

  // S06
  const s06 = screenMap['S06'];
  if (s06) {
    const backBtn = findByIconOrName(s06, 'back') || findByIconOrName(s06, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S01');
    const btnReview = findByText(s06, 'ดูรีวิวที่ยืนยันแล้ว');
    if (btnReview) await addLink(btnReview, 'S32');
    const toChecklist = findByText(s06, 'ไปเช็กลิสต์ก่อนโอน');
    if (toChecklist) await addLink(toChecklist, 'S10');
  }

  // S07
  const s07 = screenMap['S07'];
  if (s07) {
    const backBtn = findByIconOrName(s07, 'back') || findByIconOrName(s07, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S04');
    const reqProof = findByText(s07, 'ขอ Proof Code จากคนขาย');
    if (reqProof) await addLink(reqProof, 'S12');
    const reportAcc = findByText(s07, 'รายงานบัญชีนี้');
    if (reportAcc) await addLink(reportAcc, 'S33');
    const backResult = findByText(s07, 'กลับไปดูผลการตรวจ');
    if (backResult) await addLink(backResult, 'S04');
  }

  // S08
  const s08 = screenMap['S08'];
  if (s08) {
    const backBtn = findByIconOrName(s08, 'back') || findByIconOrName(s08, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S04');
    const toChecklist = findByText(s08, 'ไปเช็กลิสต์ก่อนโอน');
    if (toChecklist) await addLink(toChecklist, 'S10');
    const toReport = findByText(s08, 'รายงานผู้ขายคนนี้');
    if (toReport) await addLink(toReport, 'S33');
  }

  // S09
  const s09 = screenMap['S09'];
  if (s09) {
    ['รองเท้า', 'ไอที', 'เสื้อผ้า', 'กล้อง'].forEach(cat => {
      const card = findByText(s09, cat);
      if (card) addLink(card, 'S10');
    });
  }

  // S10
  const s10 = screenMap['S10'];
  if (s10) {
    const backBtn = findByIconOrName(s10, 'back') || findByIconOrName(s10, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S09');
    const unchecked = findByText(s10, 'ป้ายแท็ก') || findByText(s10, 'พื้นรองเท้า') || findByText(s10, 'ยังไม่ตรวจ');
    if (unchecked) await addLink(unchecked, 'S11');
    const btnProof = findByText(s10, 'สร้าง Proof Code');
    if (btnProof) await addLink(btnProof, 'S12');
    const btnTpl = findByText(s10, 'คำถามสำเร็จรูป');
    if (btnTpl) await addLink(btnTpl, 'S14');
  }

  // S11
  const s11 = screenMap['S11'];
  if (s11) {
    const backBtn = findByIconOrName(s11, 'back') || findByIconOrName(s11, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S09');
    const btnProof = findByText(s11, 'สร้าง Proof Code');
    if (btnProof) await addLink(btnProof, 'S12');
    const btnDone = findByText(s11, 'ตรวจครบแล้ว บันทึกผล');
    if (btnDone) await addLink(btnDone, 'S16');
  }

  // S12
  const s12 = screenMap['S12'];
  if (s12) {
    const backBtn = findByIconOrName(s12, 'back') || findByIconOrName(s12, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S10');
    const copyMsg = findByText(s12, 'คัดลอกข้อความส่งให้คนขาย');
    if (copyMsg) await addLink(copyMsg, 'S13');
    const sellerSent = findByText(s12, 'คนขายส่งรูปมาแล้ว');
    if (sellerSent) await addLink(sellerSent, 'S11');
  }

  // S13
  const s13 = screenMap['S13'];
  if (s13) {
    const backBtn = findByIconOrName(s13, 'back') || findByIconOrName(s13, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S10');
    const copyBtn = findByText(s13, 'คัดลอก') || findByIconOrName(s13, 'copy');
    if (copyBtn) await addLink(copyBtn, 'S13');
    const sellerSent = findByText(s13, 'คนขายส่งรูปมาแล้ว');
    if (sellerSent) await addLink(sellerSent, 'S11');
  }

  // S14 & S15
  [screenMap['S14'], screenMap['S15']].forEach(screen => {
    if (!screen) return;
    const backBtn = findByIconOrName(screen, 'back') || findByIconOrName(screen, 'arrow_back');
    if (backBtn) addLink(backBtn, 'S10');
    const backChecklist = findByText(screen, 'กลับไปทำเช็กลิสต์ต่อ');
    if (backChecklist) addLink(backChecklist, 'S10');
    const tplRow = findByText(screen, 'ขอดูรูป') || findByText(screen, 'ใบเสร็จ') || findByText(screen, 'วิดีโอ');
    if (tplRow) addLink(tplRow, 'S15');
  });

  // S16
  const s16 = screenMap['S16'];
  if (s16) {
    const btnBreak = findByText(s16, 'ไปเบรกก่อนโอน');
    if (btnBreak) await addLink(btnBreak, 'S19');
    const btnNew = findByText(s16, 'เริ่มตรวจดีลใหม่');
    if (btnNew) await addLink(btnNew, 'S01');
  }

  // S17
  const s17 = screenMap['S17'];
  if (s17) {
    const backBtn = findByIconOrName(s17, 'back') || findByIconOrName(s17, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S01');
    const nextChat = findByText(s17, 'ต่อไป: ตรวจแชทคนขาย');
    if (nextChat) await addLink(nextChat, 'S18');
  }

  // S18
  const s18 = screenMap['S18'];
  if (s18) {
    const backBtn = findByIconOrName(s18, 'back') || findByIconOrName(s18, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S17');
    const nextBreak = findByText(s18, 'ต่อไป: เบรกก่อนโอน');
    if (nextBreak) await addLink(nextBreak, 'S19');
  }

  // S19
  const s19 = screenMap['S19'];
  if (s19) {
    const backBtn = findByIconOrName(s19, 'back') || findByIconOrName(s19, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S18');
    const btnSafe = findByText(s19, 'ตอบใช่ครบ 3 ข้อ พร้อมโอน') || findByText(s19, 'พร้อมโอน');
    if (btnSafe) await addLink(btnSafe, 'S20');
    const btnUnsure = findByText(s19, 'ยังมีข้อที่ไม่แน่ใจ');
    if (btnUnsure) await addLink(btnUnsure, 'S21');
  }

  // S20
  const s20 = screenMap['S20'];
  if (s20) {
    const btnHome = findByText(s20, 'กลับหน้าแรก');
    if (btnHome) await addLink(btnHome, 'S01');
    const btnReport = findByText(s20, 'รายงานถ้าพบปัญหาภายหลัง');
    if (btnReport) await addLink(btnReport, 'S33');
  }

  // S21
  const s21 = screenMap['S21'];
  if (s21) {
    const btnCheckMore = findByText(s21, 'กลับไปเช็กเพิ่ม');
    if (btnCheckMore) await addLink(btnCheckMore, 'S10');
    const btnReport = findByText(s21, 'รายงานพฤติกรรมน่าสงสัย');
    if (btnReport) await addLink(btnReport, 'S33');
  }

  // S22
  const s22 = screenMap['S22'];
  if (s22) {
    const btnVerify = findByText(s22, 'ยืนยันตัวตนทันที');
    if (btnVerify) await addLink(btnVerify, 'S23');
    const cardDeal = findByText(s22, 'ดีลที่รอยืนยัน');
    if (cardDeal) await addLink(cardDeal, 'S28');
  }

  // S23
  const s23 = screenMap['S23'];
  if (s23) {
    const backBtn = findByIconOrName(s23, 'back') || findByIconOrName(s23, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S22');
    const nextSelfie = findByText(s23, 'ต่อไป: ถ่ายเซลฟี่');
    if (nextSelfie) await addLink(nextSelfie, 'S24');
  }

  // S24
  const s24 = screenMap['S24'];
  if (s24) {
    const backBtn = findByIconOrName(s24, 'back') || findByIconOrName(s24, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S23');
    const btnSnap = findByText(s24, 'ถ่ายภาพ');
    if (btnSnap) await addLink(btnSnap, 'S25');
  }

  // S25
  const s25 = screenMap['S25'];
  if (s25) {
    const btnProfile = findByText(s25, 'ดูโปรไฟล์ของฉัน');
    if (btnProfile) await addLink(btnProfile, 'S26');
  }

  // S26 & S27
  const s26 = screenMap['S26'];
  if (s26) {
    const copyLink = findByText(s26, 'คัดลอกลิงก์โปรไฟล์ไปแปะในโพสต์ขาย');
    if (copyLink) await addLink(copyLink, 'S27');
    const cardDeal = findByText(s26, 'ดีลที่รอยืนยัน');
    if (cardDeal) await addLink(cardDeal, 'S28');
  }

  const s27 = screenMap['S27'];
  if (s27) {
    const copyBtn = findByText(s27, 'คัดลอก') || findByIconOrName(s27, 'copy');
    if (copyBtn) await addLink(copyBtn, 'S27');
    const cardDeal = findByText(s27, 'ดีลที่รอยืนยัน');
    if (cardDeal) await addLink(cardDeal, 'S28');
  }

  // S28
  const s28 = screenMap['S28'];
  if (s28) {
    const backBtn = findByIconOrName(s28, 'back') || findByIconOrName(s28, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S26');
    const btnSuccess = findByText(s28, 'ยืนยันว่าซื้อขายสำเร็จ');
    if (btnSuccess) await addLink(btnSuccess, 'S29');
    const btnProblem = findByText(s28, 'มีปัญหากับดีลนี้');
    if (btnProblem) await addLink(btnProblem, 'S33');
  }

  // S29
  const s29 = screenMap['S29'];
  if (s29) {
    const backBtn = findByIconOrName(s29, 'back') || findByIconOrName(s29, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S28');
    const star = findByIconOrName(s29, 'star') || findByText(s29, '★') || findByText(s29, 'คะแนน');
    if (star) await addLink(star, 'S30');
  }

  // S30
  const s30 = screenMap['S30'];
  if (s30) {
    const backBtn = findByIconOrName(s30, 'back') || findByIconOrName(s30, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S29');
    const btnSubmit = findByText(s30, 'ส่งรีวิว');
    if (btnSubmit) await addLink(btnSubmit, 'S31');
  }

  // S31
  const s31 = screenMap['S31'];
  if (s31) {
    const btnProfile = findByText(s31, 'ไปที่โปรไฟล์ของฉัน');
    if (btnProfile) await addLink(btnProfile, 'S26');
  }

  // S32
  const s32 = screenMap['S32'];
  if (s32) {
    const backBtn = findByIconOrName(s32, 'back') || findByIconOrName(s32, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S06');
    const btnMeet = findByText(s32, 'ส่งข้อความยืนยันนัดหมาย');
    if (btnMeet) await addLink(btnMeet, 'S28');
  }

  // S33
  const s33 = screenMap['S33'];
  if (s33) {
    const cardSeller = findByText(s33, 'รายงานคนขาย') || findByText(s33, 'ผู้ขาย');
    if (cardSeller) await addLink(cardSeller, 'S34');
    const cardPost = findByText(s33, 'รายงานโพสต์') || findByText(s33, 'โพสต์');
    if (cardPost) await addLink(cardPost, 'S34');
  }

  // S34
  const s34 = screenMap['S34'];
  if (s34) {
    const backBtn = findByIconOrName(s34, 'back') || findByIconOrName(s34, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S33');
    const dropzone = findByText(s34, 'แนบหลักฐาน') || findByText(s34, 'รูปภาพ') || findByIconOrName(s34, 'upload') || findByIconOrName(s34, 'dropzone');
    if (dropzone) await addLink(dropzone, 'S35');
  }

  // S35
  const s35 = screenMap['S35'];
  if (s35) {
    const backBtn = findByIconOrName(s35, 'back') || findByIconOrName(s35, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S34');
    const btnNext = findByText(s35, 'ถัดไป: ใส่รายละเอียด');
    if (btnNext) await addLink(btnNext, 'S36');
  }

  // S36
  const s36 = screenMap['S36'];
  if (s36) {
    const btnBack = findByText(s36, 'ย้อนกลับ');
    if (btnBack) await addLink(btnBack, 'S35');
    const btnSubmit = findByText(s36, 'ส่งรายงาน');
    if (btnSubmit) await addLink(btnSubmit, 'S37');
  }

  // S37
  const s37 = screenMap['S37'];
  if (s37) {
    const btnHome = findByText(s37, 'กลับหน้าหลัก');
    if (btnHome) await addLink(btnHome, 'S01');
    const btnStatus = findByText(s37, 'ดูสถานะรายงานของฉัน');
    if (btnStatus) await addLink(btnStatus, 'S38');
  }

  // S38
  const s38 = screenMap['S38'];
  if (s38) {
    const backBtn = findByIconOrName(s38, 'back') || findByIconOrName(s38, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S37');
    const btnHome = findByText(s38, 'กลับหน้าหลัก');
    if (btnHome) await addLink(btnHome, 'S01');
  }

  // S39
  const s39 = screenMap['S39'];
  if (s39) {
    const backBtn = findByIconOrName(s39, 'back') || findByIconOrName(s39, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S01');
    const itemWarn = findByText(s39, 'รายงานของคุณช่วยเตือน');
    if (itemWarn) await addLink(itemWarn, 'S38');
    const itemAcc = findByText(s39, 'บัญชีของคุณถูกรายงาน');
    if (itemAcc) await addLink(itemAcc, 'S40');
    const itemDeal = findByText(s39, 'ดีลรอยืนยัน: คุณพิม') || findByText(s39, 'ดีลรอยืนยัน');
    if (itemDeal) await addLink(itemDeal, 'S28');
  }

  // S40
  const s40 = screenMap['S40'];
  if (s40) {
    const backBtn = findByIconOrName(s40, 'back') || findByIconOrName(s40, 'arrow_back');
    if (backBtn) await addLink(backBtn, 'S39');
    const btnProof = findByText(s40, 'ส่งคำชี้แจงและหลักฐาน');
    if (btnProof) await addLink(btnProof, 'S41');
  }

  // S41
  const s41 = screenMap['S41'];
  if (s41) {
    const btnHome = findByText(s41, 'กลับหน้าหลัก');
    if (btnHome) await addLink(btnHome, 'S01');
  }

  console.log("🎉 ALL SCREEN CONNECTIONS AND FLOW STARTING POINTS APPLIED SUCCESSFULLY!");
  figma.notify("✅ Linked all prototype screens and created 7 Usability Flow Starting Points!");
})();
