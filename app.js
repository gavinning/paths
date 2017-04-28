const path = require('path')
const glob = require('glob')
const Config = require('vpm-config')
const extend = require('aimee-extend')

// 默认过滤条件
let defaultFilter = ['**/node_modules/**', '**/.svn/**', '**/.git/**']

// 多个文件查询
function dirs(folders) {
    return folders.map(url => {
        let folder = {}
        let foldername = path.basename(url)
        folder[foldername] = dir(url)
        return folder
    })
}

// 单个文件夹查询
function dir(cwd){
    let sun, map = {}
    glob
        // 查询当前目录下js文件
        .sync('**/**.{js,json,conf,config}', {nodir: true, cwd: cwd})
        // map相对路径与绝对路径
        .map(item => {
            return {
                src: item,
                url: path.join(cwd, item)
            }
        })
        // map路径对象
        .map(item => createPaths(item))
        // 合并路径对象
        .forEach(item => {
            extend(true, map, item)
        })
    return map
}

// 根据文件路径创建路径对象
// let map = {src: 'a/b/c.js', url: '/usr/a/b/c.js'}
// createPaths(map) => {a:{b:{c: '/usr/a/b/c.js'}}}
function createPaths(map) {
    let config = new Config
    config.init()
    config.set(map.src.replace(/\.(js|json|conf|config)$/, '').split('/').join('.'), map.url)
    let paths = config.get()
    config = null
    return paths
}

// 格式化参数
function parse(rootPath, folders, filter) {
    let config = {}

    if(typeof rootPath === 'object'){
        config = rootPath
    }
    if(typeof rootPath === 'string'){
        config = {
            root: rootPath,
            folders: folders || [],
            filter: defaultFilter.concat(filter || [])
        }
    }
    return config
}

class Paths {
    constructor(rootPath, folders, filter) {
        let config = parse(rootPath, folders, filter)
        if(!config.root) {
            throw new Error("can't find rootPath")
        }
        if(config.folders.length === 0){
            config.folders = glob.sync(path.join(config.root, '*/'), {ignore: config.filter})
        }

        this.root = config.root

        dirs(config.folders).forEach(folder => extend(true, this, folder))
    }
}

module.exports = global.paths = Paths
