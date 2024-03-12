/* eslint-disable no-console */
import { extractI18n } from '@yuntijs/lowcode-i18n-extract';
import { MonacoEditor } from '@yuntijs/ui';
import { Button, Flex } from 'antd';
import React, { useState } from 'react';

import schemaData from '../tests/data/schema.json';

const LowcodeI18nExtractDemo: React.FC = () => {
  const [schema, setSchema] = useState(JSON.stringify(schemaData, null, 2));
  const [schemaExtracted, setSchemaExtracted] = useState<string>();
  const onExtractI18nBtnClick = () => {
    const { matches, schema: schemaWithI18n } = extractI18n(JSON.parse(schema));
    console.log('matches =>', matches);
    console.log('schemaWithI18n =>', schemaWithI18n);
    setSchemaExtracted(JSON.stringify(schemaWithI18n, null, 2));
  };

  return (
    <Flex gap="middle" vertical>
      <h3>Input Schema here:</h3>
      <MonacoEditor
        defaultValue={schema}
        height={450}
        language="json"
        onChange={value => setSchema(value)}
        supportFullScreen={true}
      />
      <Button onClick={onExtractI18nBtnClick} size="large" type="primary">
        Extract I18n Texts
      </Button>
      <h3>Results:</h3>
      <MonacoEditor
        height={450}
        language="json"
        readOnly
        supportFullScreen={true}
        value={schemaExtracted}
      />
    </Flex>
  );
};

export default LowcodeI18nExtractDemo;
