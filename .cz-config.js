module.exports = {
  // 可选类型
  types: [
    { value: '特性', name: '特性:    一个新的特性、新功能' },
    { value: '修复', name: '修复:    修复一个Bug' },
    { value: '文档', name: '文档:    修改了某个文档' },
    { value: '格式', name: '格式:    代码格式化' },
    { value: '重构', name: '重构:    代码重构，注意和特性、修复区分开' },
    { value: '性能', name: '性能:    提升性能' },
    { value: '测试', name: '测试:    添加一个测试' },
    { value: '工具', name: '工具:    开发工具变动(构建、脚手架工具等)' },
    { value: '回滚', name: '回滚:    代码回退' },
  ],
  // 消息步骤
  messages: {
    type: '请选择提交类型:',
    customScope: '请输入修改范围(可选):',
    subject: '摘要 -> 描述修改内容(必填):',
    body: '详情 -> 描述修改内容(可选):',
    confirmCommit: '确认提交上述所填信息？(y/n/e/h)',
  },
  // 跳过问题
  skipQuestions: ['footer'],
  // subject文字长度默认是72
  subjectLimit: 72,
};
