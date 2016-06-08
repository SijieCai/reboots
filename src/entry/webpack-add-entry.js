import fs from 'fs';
import esprima from 'esprima';
import walk from 'esprima-walk';
import escodegen from 'escodegen';

export default function(path, entries) {
    const entrySnippet = '!{' + entries.map((entry)=>`${entry}: entryDir + '/${entry}'`).join(', ') + '}';
    const rewritesSnippet = '![' + entries.map((entry)=>`{from: /\\/${entry}/, to: '/${entry}.html'}`).join(', ') + ']';
    
    let entryAST = esprima.parse(entrySnippet).body[0].expression.argument.properties;

    let rewritesAST = esprima.parse(rewritesSnippet).body[0].expression.argument.elements;

    let data = fs.readFileSync(path, 'utf8');
    let parsed = esprima.parse(data); 
    walk.walkAddParent(parsed, function(node) { 
      // console.log(node.type, node.key);
      if(node.type === 'Property' && (node.key.name === 'entry' || node.key.name === 'alias')) {
        let props = node.value.properties;
        let existingEntries = props.map(e=>e.key.name);
        entryAST = entryAST.filter(item=>existingEntries.indexOf(item.key.name) < 0);
        let newProps = props.concat(entryAST);
        
        node.value.properties = newProps;
      }

      if(node.type === 'Property' && node.key.name === 'rewrites') {

        let elements = node.value.elements;
        let existingElements = elements.map(e=>e.properties[1].value.value);
        rewritesAST = rewritesAST.filter(item=>existingElements.indexOf(item.properties[1].value.value) < 0);
        let newElements = elements.concat(rewritesAST);

        node.value.elements = newElements;
      }
    });
    let options = { format: { indent: { style: '  ' } } };
    let code = escodegen.generate(parsed, options);
    
    fs.writeFileSync(path, code, 'utf8');
}
