'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const urllib = require('urllib');
const fse = require('fs-extra');
const compressing = require('compressing');
module.exports = class PackageManager {
  constructor(app) {
    this.app = app;
    this.packageDir = path.join(app.baseDir, 'package');
    // 包信息
    this.packageCache = {};
    // 查询包信息缓存
    this.queryPackageCache = {};
    // 下载包缓存
    this.retryDownloadCache = {};
    // 检查结果
    this.checkPackageCache = {};
  }

  async getDevPackage(route) {
    const filepath = path.join(os.tmpdir(), 'render-package.json');
    if (!fs.existsSync(filepath)) {
      this.app.logger.error(`No configuration file ${filepath} exists, the file is built by the application build`);
      return null;
    }
    const json = await fse.readJSON(filepath);
    return json.pkgs.find(pkg => {
      return pkg.route === route ;
    });
  }

  async getPackage(route) {
    // 初始化计数
    if (this.queryPackageCache[route] === undefined) {
      this.queryPackageCache[route] = 0;
    }

    // 最多查询 3 次
    if (this.queryPackageCache[route] >= 3) {
      return null;
    }

    // 从数据库查询配置信息
    if (!this.packageCache[route]) {
      this.queryPackageCache[route] += 1;
      this.packageCache[route] = await this.queryPackageInfo(route);
      // 重置计数
      if (this.packageCache[route]) {
        this.queryPackageCache[route] = 0;
      }
    }
    return this.packageCache[route];
  }

  // 验证请求是否合法和文件是否存在
  async validate(route) {

    // 初始化下载计数
    if (this.retryDownloadCache[route] === undefined) {
      this.retryDownloadCache[route] = 0;
    }

    // 最多尝试下载 3 次
    if (this.retryDownloadCache[route] >=3 ) {
      return { state: { code: 40002, msg: `package view file not exist ${route}` } };
    }

    const pkgInfo = await this.getPackage(route);
    if (pkgInfo) {
      const viewDir = this.app.config.view.root[0];
      const { tag, version, entry } = pkgInfo;
      const filepath = path.join(viewDir, tag, version, entry);
      const manifest = path.join(viewDir, tag, version, pkgInfo.manifest);

      // 检查服务端渲染文件是否存在
      if (!fs.existsSync(filepath)) {
        this.retryDownloadCache[route] += 1;
        const packageDir = await this.download(pkgInfo);
        await this.copyFile(pkgInfo, packageDir);
        if (!fs.existsSync(filepath)) {
          return { state: { code: 40003, msg: `download package error, missing view file ${route}` } };
        }
        // 重置下载计数
        this.retryDownloadCache[route] = 0;
      }

      return { state: { code: 20000, msg: 'valid' }, data : { entry, filepath, manifest } };
    }
    return { state: { code: 40000, msg: `invalid request ${route}` } };
  }

  async queryPackageInfo(route) {
    // 根据 name 从数据和缓存里面获取配置 或者 启动时从数据库获取所有配置，然后定时任务更新
    const packageList = [{
      "name": "render-vue-package",
      "tag": "bec1be26",
      "version": "0.1.4",
      "url": 'https://registry.npmjs.org/render-vue-package/-/render-vue-package-0.1.4.tgz',
      "online": true,
      "route": "/home",
      "entry": "home.js",
      "engine": "vue",
      "render": "render",
      "clientdir": "client",
      "serverdir": "server",
      "manifest": "./manifest.json",
    }, {
      "name": "render-react-package",
      "tag": "e0b05256",
      "version": "0.1.0",
      "url": 'https://registry.npmjs.org/render-vue-package/-/render-react-package-0.1.0.tgz',
      "online": true,
      "route": "/react",
      "entry": "react.js",
      "engine": "react",
      "render": "render",
      "clientdir": "client",
      "serverdir": "server",
      "manifest": "./manifest.json",
    }];
    return packageList.find(item => item.route === route);
  }

  async download(pkgInfo) {
    // 这里可以考虑存储在系统磁盘临时目录
    const { name, version, url } = pkgInfo;
    const packageDir = path.join(this.packageDir, name, version);
    const response = await urllib.request(url, { streaming: true, followRedirect: true });
    await compressing.tgz.uncompress(response.res, packageDir);
    return packageDir;
  }

  async copyFile(pkgInfo, packageDir) {
    const { tag, version, clientdir, serverdir } = pkgInfo;
    const viewDir = this.app.config.view.root[0];
    const staticDir = this.app.config.static.dir;
    const codeDir = path.join(packageDir, 'package');
    await fse.copy(path.join(codeDir, 'manifest.json'), path.join(viewDir, tag, version, 'manifest.json'));
    await fse.copy(path.join(codeDir, serverdir), path.join(viewDir, tag, version));
    await fse.copy(path.join(codeDir, clientdir), path.join(staticDir, tag, version));
  }
};