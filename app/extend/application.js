'use strict';
const SymbolPackageManager = Symbol.for('Symbol#PackageManager');
const SymbolRenderManager = Symbol.for('Symbol#RenderManager');
const PackageManager = require('../lib/PackageManager');
const RenderManager = require('../lib/RenderManager');
module.exports = {
  get packageManager() {
    if (!this[SymbolPackageManager]) {
      this[SymbolPackageManager] = new PackageManager(this);
    }
    return this[SymbolPackageManager];
  },
  get renderManager() {
    if (!this[SymbolRenderManager]) {
      this[SymbolRenderManager] = new RenderManager(this);
    }
    return this[SymbolRenderManager];
  }
};