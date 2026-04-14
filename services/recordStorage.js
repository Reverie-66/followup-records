// services/recordStorage.js
const STORAGE_KEY = 'followup_records';

// 获取全部记录（已排序：按创建时间倒序）
function getAllRecords() {
  const data = uni.getStorageSync(STORAGE_KEY);
  if (!data) return [];
  // 确保按 createdAt 降序排列
  return data.sort((a, b) => b.createdAt - a.createdAt);
}

// 保存全部记录
function saveAllRecords(records) {
  uni.setStorageSync(STORAGE_KEY, records);
}

// 新增或更新记录
export function saveRecord(record) {
  const records = getAllRecords();
  const now = Date.now();
  const existingIndex = records.findIndex(r => r.id === record.id);
  
  if (existingIndex > -1) {
    // 更新
    records[existingIndex] = {
      ...records[existingIndex],
      ...record,
      updatedAt: now
    };
  } else {
    // 新增
    records.push({
      ...record,
      id: `${now}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: now,
      updatedAt: now
    });
  }
  saveAllRecords(records);
  return record;
}

// 根据 ID 获取单条记录
export function getRecordById(id) {
  const records = getAllRecords();
  return records.find(r => r.id === id);
}

// 分页查询
export function getRecordPage(pageSize = 10, page = 1) {
  const records = getAllRecords();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = records.slice(start, end);
  return {
    data: pageData,
    total: records.length,
    hasMore: end < records.length
  };
}

// 删除记录（可选）
export function deleteRecord(id) {
  const records = getAllRecords();
  const filtered = records.filter(r => r.id !== id);
  saveAllRecords(filtered);
}