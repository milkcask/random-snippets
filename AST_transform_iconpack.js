const t = require("@babel/types");

module.exports = function () {
  return {
    visitor: {
      ExpressionStatement(path) {
        // Remove CJS syntax oppressively
        path.remove();
      },
      VariableDeclarator(path) {
        // There should be 1 variable (not removed by ExpressionStatement visitor)
        
        // Skip other variables (extraneous or from post-mutation recursions)
        if (path.node.id.name === "_default") {
          const iconNodes = path.node.init.properties.map((property) => {
            const tName = property.key?.name ?? property.key?.value;
            const name = /^\d/.test(tName) ? `_${tName}` : tName;
            return t.exportNamedDeclaration(
              t.variableDeclaration("const", [
                t.variableDeclarator(t.identifier(name), property.value),
              ]),
              [t.exportSpecifier(t.identifier(name), t.identifier(name))]
            );
          });
          
          const newShorthandProperties = path.node.init.properties.map((property) => {
            const tName = property.key?.name ?? property.key?.value;
            const name = /^\d/.test(tName) ? `_${tName}` : tName;
            return t.objectProperty(
              t.identifier(name),
              t.identifier(name),
              false,
              true
            );
          });
          
          // Mutate (remove _default, add everything transformed)
          path.parentPath.replaceWithMultiple([
            ...iconNodes,
            t.variableDeclaration("const", [
              t.variableDeclarator(
                t.identifier("_allIcons"),
                t.objectExpression(newShorthandProperties)
              ),
            ]),
            t.exportDefaultDeclaration(t.identifier("_allIcons")),
          ]);
        }
      },
    },
  };
};