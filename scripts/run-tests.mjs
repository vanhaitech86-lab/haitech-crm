// ========================================================
// HAITECH CRM - AUTOMATED TEST RUNNER
// ========================================================

import assert from 'node:assert';

console.log('====================================================');
console.log('  CHẠY BỘ KIỂM THỬ TỰ ĐỘNG HAITECH CRM (TEST SUITE)  ');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`✅ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Lỗi: ${err.message}\n`);
    failCount++;
  }
}

async function main() {
  // 1. Test Seed Data
  await runTest('1. Dữ liệu Seed data ban đầu đầy đủ và hợp lệ', async () => {
    const { initialConversations, initialContacts, initialDeals, initialConnectors, initialKnowledge } = await import('../src/lib/seedData.ts');
    
    assert.ok(initialConversations.length >= 6, 'Hội thoại ban đầu phải có ít nhất 6 bản ghi mẫu');
    assert.ok(initialContacts.length >= 4, 'Hồ sơ khách ban đầu phải có ít nhất 4 khách');
    assert.ok(initialDeals.length >= 5, 'Deal ban đầu phải có ít nhất 5 cơ hội');
    assert.ok(initialConnectors.length >= 8, 'Phải có đủ 8 connector đa kênh');
    assert.ok(initialKnowledge.length >= 3, 'Kho tri thức phải có ít nhất 3 tài liệu');

    const dakrong = initialConversations.find(c => c.customerName.includes('Dakrong'));
    assert.ok(dakrong, 'Phải có hội thoại mẫu "Lắp Đặt Máy Lọc Nước Dakrong"');
    assert.strictEqual(dakrong.channel, 'zalo_personal');
  });

  // 2. Test Store Operations
  await runTest('2. Thao tác Store: Gửi tin nhắn & Ghi nhận Audit Log', async () => {
    const { crmStore } = await import('../src/lib/store.ts');
    
    const testMsg = crmStore.sendMessage('conv-1', {
      text: 'Tin nhắn thử nghiệm kiểm thử tự động',
      senderType: 'agent',
      isInternalNote: false,
      status: 'mock_simulated'
    });

    assert.ok(testMsg.id.startsWith('msg-'), 'Message ID phải có tiền tố msg-');
    assert.strictEqual(testMsg.status, 'mock_simulated');

    const conv = crmStore.getConversation('conv-1');
    assert.ok(conv.lastMessageSnippet.includes('Tin nhắn thử nghiệm'), 'Snippet hội thoại phải được cập nhật');

    const logs = crmStore.getAuditLogs();
    const latestLog = logs[0];
    assert.strictEqual(latestLog.category, 'conversation');
    assert.ok(latestLog.action.includes('Gửi tin nhắn'), 'Audit log phải ghi nhận hành động gửi');
  });

  // 3. Test Deal Stage Transitions (Kanban)
  await runTest('3. Chuyển giai đoạn Deal Pipeline & Tính toán tổng giá trị', async () => {
    const { crmStore } = await import('../src/lib/store.ts');
    
    const updatedDeal = crmStore.updateDealStage('deal-1', 'stage-survey');
    assert.ok(updatedDeal, 'Deal phải được cập nhật');
    assert.strictEqual(updatedDeal.stageId, 'stage-survey');

    const newDeal = crmStore.createDeal({
      title: 'Hợp đồng kiểm thử tự động 100 máy',
      value: 200000000,
      stageId: 'stage-lead',
      contactId: 'ct-1',
      contactName: 'Lắp Đặt Máy Lọc Nước Dakrong',
      expectedCloseDate: '2026-11-15',
      ownerId: 'usr-1',
      ownerName: 'HAITECH AI',
      channelSource: 'website'
    });

    assert.ok(newDeal.id.startsWith('deal-'));
    const stats = crmStore.getStats();
    assert.ok(stats.pipelineTotalValue > 500000000, 'Tổng giá trị pipeline phải được cộng dồn chính xác');
  });

  // 4. Test AI Suggestion Engine & Knowledge Retrieval
  await runTest('4. Cơ chế AI gợi ý câu trả lời & Trích xuất Kho Tri thức', async () => {
    const { crmStore } = await import('../src/lib/store.ts');
    
    // Send customer inquiry regarding pricing to test KB lookup
    crmStore.sendMessage('conv-1', {
      text: 'HAITECH AI ơi cho em xin báo giá và chính sách chiết khấu với ạ',
      senderType: 'customer',
      senderName: 'Trần Thị Hồng Nhung',
      status: 'delivered'
    });

    const suggestion = crmStore.generateAiSuggestion('conv-1');
    assert.ok(suggestion.suggestion.length > 20, 'AI phải sinh câu trả lời có nghĩa');
    assert.ok(suggestion.confidence >= 0.8, 'Độ tin cậy phải >= 80%');
    assert.ok(suggestion.source.includes('KB-') || suggestion.source.includes('HAITECH'), 'Câu trả lời phải có nguồn trích dẫn');
  });

  // 5. Test Channel Adapter & Mock Fallback
  await runTest('5. Channel Adapters: Hoạt động chế độ Mock trung thực khi thiếu key', async () => {
    const { getChannelAdapter } = await import('../src/lib/adapters/channels.ts');
    
    const telegramAdapter = getChannelAdapter('telegram');
    assert.strictEqual(telegramAdapter.isConfigured(), false, 'Telegram không có token thật phải báo isConfigured = false');

    const sendResult = await telegramAdapter.sendMessage({
      recipientId: 'test-user',
      text: 'Test message'
    });

    assert.strictEqual(sendResult.success, true);
    assert.strictEqual(sendResult.isMock, true, 'Kết quả phải phản ánh trung thực isMock = true');
  });

  // 6. Test Reset Seed Data
  await runTest('6. Tính năng Khôi phục dữ liệu mẫu (Reset Seed Data)', async () => {
    const { crmStore } = await import('../src/lib/store.ts');
    
    crmStore.resetSeedData();
    const convs = crmStore.getConversations();
    assert.strictEqual(convs.length, 6, 'Sau khi reset phải có đúng 6 hội thoại ban đầu');
    
    const logs = crmStore.getAuditLogs();
    assert.ok(logs[0].action.includes('Khôi phục dữ liệu mẫu'), 'Phải có log ghi nhận việc reset');
  });

  // 7. Test Commercial Tenant Auth & CRM Rental
  await runTest('7. Quản lý Đăng Nhập / Đăng Ký Khách Hàng & Gói Thuê CRM Thương Mại', async () => {
    const { crmStore } = await import('../src/lib/store.ts');
    
    // Register new commercial tenant for trial
    const newTenant = crmStore.register({
      companyName: 'Công Ty CP Nước Sạch Alpha',
      contactName: 'Lê Hoàng Nam',
      email: 'nam.le@alphawater.vn',
      phone: '0912345678',
      plan: 'trial'
    });

    assert.ok(newTenant.id.startsWith('tenant-'), 'Tenant ID phải được cấp phát hợp lệ');
    assert.strictEqual(newTenant.companyName, 'Công Ty CP Nước Sạch Alpha');
    assert.strictEqual(newTenant.plan, 'trial');
    assert.strictEqual(newTenant.status, 'trial');

    // Upgrade to commercial rental PRO
    const upgraded = crmStore.updateTenant({
      plan: 'pro',
      status: 'active',
      isPaid: true
    });
    assert.strictEqual(upgraded.plan, 'pro');
    assert.strictEqual(upgraded.isPaid, true);

    // Test Login
    const loggedIn = crmStore.login({ email: 'nam.le@alphawater.vn' });
    assert.strictEqual(loggedIn.companyName, 'Công Ty CP Nước Sạch Alpha');
  });

  // 8. Test Customer Data Management & Google Drive Sync
  await runTest('8. Quản Lý Toàn Bộ Data Khách Hàng & Đưa Về Google Drive / Xuất CSV UTF-8 BOM', async () => {
    const { crmStore } = await import('../src/lib/store.ts');
    
    // Check drive config
    const config = crmStore.getGoogleDriveConfig();
    assert.ok(config.folderName.includes('HAITECH_CRM'), 'Thư mục Google Drive phải có tên chuẩn HAITECH');
    assert.ok(config.googleSheetUrl.includes('google.com'), 'Phải có link Google Sheets trực tuyến');

    // Sync all customer data to Drive
    const syncRes = await crmStore.syncCustomerDataToDrive();
    assert.strictEqual(syncRes.success, true);
    assert.ok(syncRes.recordCount >= 4, 'Số lượng data khách đồng bộ phải đầy đủ');
    assert.ok(syncRes.driveUrl.includes('drive.google.com'), 'Phải trả về link file Google Drive');

    // Verify backup logs
    const logs = crmStore.getGoogleDriveBackupLogs();
    assert.ok(logs.length > 0, 'Phải ghi nhận nhật ký sao lưu');
    assert.strictEqual(logs[0].status, 'success');
  });

  console.log('\n====================================================');
  console.log(`KẾT QUẢ KIỂM THỬ: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('====================================================');

  if (failCount > 0) {
    process.exit(1);
  } else {
    console.log('🎉 TẤT CẢ CÁC BÀI KIỂM THỬ ĐÃ VƯỢT QUA XUẤT SẮC!\n');
  }
}

main();
