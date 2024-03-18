/* eslint-disable no-console */
import { extractI18n } from '@yuntijs/lowcode-i18n-extract';
import { MonacoEditor } from '@yuntijs/ui';
import { Button, Flex, Tabs } from 'antd';
import React, { useState } from 'react';

import schemaData from '../tests/data/schema.json';

const LowcodeI18nExtractDemo: React.FC = () => {
  const [schema, setSchema] = useState(JSON.stringify(schemaData, null, 2));
  const [schemaExtracted, setSchemaExtracted] = useState<string>();
  const [matches, setMatches] = useState<string>();
  const onExtractI18nBtnClick = () => {
    const results = extractI18n(JSON.parse(schema));
    console.log('matches =>', results.matches);
    console.log('schemaWithI18n =>', results.schema);
    setSchemaExtracted(JSON.stringify(results.schema, null, 2));
    setMatches(JSON.stringify(results.matches, null, 2));
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
      <Tabs
        defaultActiveKey="schema"
        items={[
          {
            key: 'schema',
            label: 'schema',
            children: (
              <MonacoEditor
                height={450}
                language="json"
                readOnly
                supportFullScreen={true}
                value={schemaExtracted}
              />
            ),
          },
          {
            key: 'matches',
            label: 'maches',
            children: (
              <MonacoEditor
                height={450}
                language="json"
                readOnly
                supportFullScreen={true}
                value={matches}
              />
            ),
          },
        ]}
      />
    </Flex>
  );
};

export default LowcodeI18nExtractDemo;
