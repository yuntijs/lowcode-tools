import fse from 'fs-extra'
import path from 'path'
import parseProps from './parseProps.mjs'

export const formatComponentSchema = (schema) => {
	let { props } = schema;
	const defaultProps = {
		__component_name: schema.componentName,
	};
	let noStyleProp = true;
	if (props && Array.isArray(props)) {
		props.forEach((prop) => {
			if (prop.defaultValue) {
				defaultProps[prop.name] = prop.defaultValue;
			}
			if (noStyleProp && ['style'].includes(prop.name)) {
				noStyleProp = false;
			}
		});
		if (noStyleProp) {
			props.push({
				name: 'style',
				propType: 'object',
			});
		}
	} else {
		props = [
			{
				name: 'style',
				propType: 'object',
			},
		];
	}
	schema.props = props;
	const parsedSchema = parseProps(schema); 
	delete parsedSchema.props;
	parsedSchema.snippets = [ 
		{
			title: schema.componentName,
			screenshot: schema.screenshot,
			schema: {
				componentName: schema.componentName,
				props: defaultProps,
			},
		},
	];
	parsedSchema.npm.version = '{{version}}'
  delete parsedSchema.npm.main
	parsedSchema.category = '其他'
	return parsedSchema;
}

export const camel2KebabComponentName = (camel) => {
  return camel
    .replace(/[A-Z]/g, (item) => {
      return `-${item.toLowerCase()}`;
    })
    .replace(/^\-/, '');
}

const defaultEntryPaths = [
  `./src/index.tsx`,
];

export const getEntry = (rootDir, entryPath) => {
  if (entryPath && fse.existsSync(path.resolve(rootDir, entryPath))) {
    return path.resolve(rootDir, entryPath).replace(/\\/g, '\\\\');
  }
  for (let i = 0; i < defaultEntryPaths.length; i++) {
    const p = path.resolve(rootDir, defaultEntryPaths[i]);
    if (fse.existsSync(p)) {
      return p.replace(/\\/g, '\\\\');
      // return p;
    }
  }
  return '';
}

export const resolvePkgJson = async(pkgJsonPath = 'package.json') => {
  const content = await loadFile(pkgJsonPath);
  const json = JSON.parse(content);
  return json;
}

export const loadFile = (filePath) => {
  const content = fse.readFileSync(filePath);
  if (typeof content === 'string') {
    return content;
  }
  return content.toString();
}

export const  parseNpmName = (npmName) => {
  if (typeof npmName !== 'string') {
    throw new TypeError('Expected a string');
  }
  const matched =
    npmName.charAt(0) === '@' ? /(@[^\/]+)\/(.+)/g.exec(npmName) : [npmName, '', npmName];
  if (!matched) {
    throw new Error(`[parse-package-name] "${npmName}" is not a valid string`);
  }
  const scope = matched[1];
  const name = (matched[2] || '').replace(/\s+/g, '').replace(/[\-_]+([^\-_])/g, ($0, $1) => {
    return $1.toUpperCase();
  });
  const uniqueName =
    (matched[1]
      ? matched[1].charAt(1).toUpperCase() +
        matched[1].slice(2).replace(/[\-_]+([^\-_])/g, ($0, $1) => {
          return $1.toUpperCase();
        })
      : '') +
    name.charAt(0).toUpperCase() +
    name.slice(1);
  return {
    scope,
    name,
    uniqueName,
  };
}