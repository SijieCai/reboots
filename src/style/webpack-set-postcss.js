import fs from 'fs';
import esprima from 'esprima';
import walk from 'esprima-walk';
import escodegen from 'escodegen';

export default function(postcssNames) {
    var filename = 'webpack.config.js';
    let data = fs.readFileSync(filename, 'utf8');
    let parsed = esprima.parse(data);

    const postcssSnippet = `!function() {return [${postcssNames.join()}];}`;
    let postcssAST = esprima.parse(postcssSnippet).body[0].expression.argument.body;
    walk.walkAddParent(parsed, function(node) {
      if(node.type === 'Property' && (node.key.name === 'postcss' && node.key.type === 'Identifier')) {
        node.value.body = postcssAST;
      }
    });
    let options = { format: { indent: { style: '  ' } } };
    let code = escodegen.generate(parsed, options);
    
    fs.writeFileSync(filename, code, 'utf8');
}
