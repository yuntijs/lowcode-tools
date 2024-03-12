import fs from 'fs';
import { join } from 'node:path';

import { extractI18n } from '../src';
import schema from './data/schema.json';

// 测试用例名字表明测试的目的
test('extract chinese text to i18n from schema', async () => {
  // 测试用例以 3A 的结构来写

  // Arrange 准备阶段，准备 mock 函数或者数据
  // 略

  // Act 执行被测对象
  const { matches, schema: schemaWithI18n } = extractI18n(schema as any);

  fs.writeFile(
    join(__dirname, './data/results/matches.json'),
    JSON.stringify(matches, null, 2),
    err => {
      if (err) {
        console.warn('write matches file failed =>', err);
      }
    }
  );

  fs.writeFile(
    join(__dirname, './data/results/schema-with-i18n.json'),
    JSON.stringify(schemaWithI18n, null, 2),
    err => {
      if (err) {
        console.warn('write newSchema file failed =>', err);
      }
    }
  );

  // Assert 断言测试结果
  expect(matches.length).toBe(16);
});
