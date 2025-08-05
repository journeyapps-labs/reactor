let overrides ={};
try{
  overrides = require("./pnpm-links")
}catch(ex){
  // file probably doesnt exist
}
const path = require("path");

function readPackage(pkg, context) {
  for(let dep in (pkg.dependencies || {})){
    if(overrides[dep]){
      const location = path.normalize(path.join(__dirname,overrides[dep] ))
      pkg.dependencies[dep] = `link:${location}`;
      console.log(`dep ${dep}  -> ${location}`);
    }
  }

  for(let dep in (pkg.devDependencies || {})){
    if(overrides[dep]){
      const location = path.normalize(path.join(__dirname,overrides[dep] ))
      pkg.devDependencies[dep] = `link:${location}`;
      console.log(`devDep ${dep}  -> ${location}`);
    }
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}