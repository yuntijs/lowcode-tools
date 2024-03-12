/** 国际化文案匹配对象 */
export interface I18nMatch {
  /** 文案 key */
  key?: string;
  /** 文案在 schema 中的路径 */
  path?: string[];
  /** 匹配到的中文文案 */
  text?: string;
  /** 是否为字符串 */
  isString?: boolean;
  /** 文案在代码中的位置 (匹配到的是函数或表达式) */
  range?: {
    start: number;
    end: number;
  };
  /** 匹配到的所有文案 (仅匹配到的是函数或表达式时存在该字段) */
  matches?: I18nMatch[];
}
