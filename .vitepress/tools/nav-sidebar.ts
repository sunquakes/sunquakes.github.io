import path, { resolve } from 'path'
import fs, { readdirSync, statSync } from 'fs'
import { marked } from 'marked'
import { DefaultTheme } from 'vitepress/theme'

declare interface Options {
  entry?: string
  ignoreFolders?: string[]
  ignoreFiles?: string[]
  dirPrefix?: string
  filePrefix?: string
  showSideIcon?: boolean
  showNavIcon?: boolean
  isCollapsible?: boolean
  collapsed?: boolean
  singleLayerNav?: boolean
  customParentFolderName?: string
}

export default class NavSiderbar {
  options: Options
  constructor(options: Options) {
    this.options = options
  }
  getCurFiles(dir: string, SuffixIncludes: string[] = [], unFileIncludes: string[] = []): string[] {
    if (!dir) return []
    const filenameList = readdirSync(dir)
      .sort()
      .filter((filename: string) => {
        const fileInfo = statSync(path.join(dir, filename))
        const suffix = filename.slice(filename.lastIndexOf('.') + 1)
        return (
          fileInfo.isFile() &&
          SuffixIncludes.includes(suffix) &&
          this.isNotReadme(filename) &&
          !unFileIncludes.includes(filename)
        )
      })
    return filenameList
  }

  getCurDirs(dir = '.'): string[] {
    if (!dir) return []
    const items = readdirSync(dir)
    const allCurDirs: string[] = []
    items.forEach((item: string) => {
      const dirName = path.join(dir, item)
      if (statSync(dirName).isDirectory() && !this.options.ignoreFolders?.includes(item)) {
        allCurDirs.push(dirName)
      }
    })
    return allCurDirs
  }

  getMdFiles = (path: string, prefix = '') => {
    if (!path) return []
    const files = this.getCurFiles(path, ['md'], this.options.ignoreFiles)
    return files.map((item: string) => prefix + item)
  }

  getDirNameByPath(dir: string): string {
    return dir.substring(dir.lastIndexOf(path.sep) + 1)
  }

  getFilterCurFolder(path: string): string[] {
    return this.getCurDirs(path)
      .sort()
      .filter((item) => !this.options.ignoreFolders?.includes(this.getDirNameByPath(item)))
  }

  getFilterCurMDFile(path: string) {
    return this.getMdFiles(path)
      .sort()
      .filter((item) => !this.options.ignoreFiles?.includes(this.getFileNameByPath(item)))
  }

  getTitleFromMDFile(filePath: string): string {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const tokens = marked.lexer(fileContent)

      for (const token of tokens) {
        if (token.type === 'heading' && token.depth === 1) {
          return token.text
        }
      }

      return this.getFileNameByPath(filePath)
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error reading file: ${error.message}`)
      } else {
        console.error(`Error reading file: ${String(error)}`)
      }
      return this.getFileNameByPath(filePath)
    }
  }

  formatText(text: string, target: 'nav' | 'sidebar', type: 'dir' | 'file') {
    if (target === 'nav') {
      return this.options.showNavIcon ? `${this.options[`${type}Prefix`]}${text}` : text
    }
    return this.options.showSideIcon ? `${this.options[`${type}Prefix`]}${text}` : text
  }

  getFileNameByPath = (dir: string) => {
    return dir.substring(dir.lastIndexOf(path.sep) + 1, dir.lastIndexOf('.'))
  }

  hasIndexMd = (path: string) => {
    if (!path) return false
    return this.getCurFiles(path, ['md'])
      .map((item) => this.getFileNameByPath(item))
      .includes('index')
  }

  isNotReadme(filename: string) {
    return filename.toLocaleLowerCase() !== 'readme.md'
  }

  capitalizeFirstLetter(word: string): string {
    if (!word) return word
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  getNav(prefixPath?: string): DefaultTheme.NavItem[] {
    const docsPath = resolve(process.cwd(), this.options.entry ?? 'docs')
    const arr: DefaultTheme.NavItem[] = []
    this.getFilterCurFolder(docsPath).forEach((dir: string) => {
      const text = this.getDirNameByPath(dir)
      if (this.options.singleLayerNav) {
        if (this.hasIndexMd(dir)) {
          arr.push({
            text: this.formatText(this.capitalizeFirstLetter(text), 'nav', 'dir'),
            link: prefixPath + '/' + text + '/'
          })
        } else {
          const firstFile = this.getFilterCurMDFile(dir)[0]
          arr.push({
            text: this.formatText(this.capitalizeFirstLetter(text), 'nav', 'dir'),
            link: prefixPath + '/' + text + '/' + firstFile
          })
        }
      } else {
        const subFolders = this.getFilterCurFolder(dir)
        const folderItems = subFolders.map((subFolderPath) => {
          const subFolderText = this.getDirNameByPath(subFolderPath)
          const firstFile = this.getFilterCurMDFile(subFolderPath)[0]
          return {
            text: this.formatText(this.capitalizeFirstLetter(subFolderText), 'nav', 'dir'),
            link: prefixPath + '/' + text + '/' + subFolderText + '/' + firstFile
          }
        })
        if (folderItems.length > 0) {
          arr.push({
            text: this.formatText(this.capitalizeFirstLetter(text), 'nav', 'dir'),
            items: [...folderItems]
          })
        } else {
          const firstFile = this.getFilterCurMDFile(dir)[0]
          arr.push({
            text: this.formatText(this.capitalizeFirstLetter(text), 'nav', 'dir'),
            link: prefixPath + '/' + text + '/' + firstFile
          })
        }
      }
    })
    let files: string[] = this.getFilterCurMDFile(docsPath).map((item) =>
      this.getFileNameByPath(item)
    )
    if (files.length > 0) {
      files.forEach((item) => {
        arr.push({
          text: this.formatText(this.capitalizeFirstLetter(item), 'nav', 'file'),
          link: '/' + item
        })
      })
    }
    return arr
  }

  getSidebar = (prefixPath?: string): DefaultTheme.Sidebar => {
    const docsPath = resolve(process.cwd(), this.options.entry ?? 'docs')
    const sidebar: DefaultTheme.Sidebar = {}
    this.getFilterCurFolder(docsPath)
      .sort()
      .forEach((dir: string) => {
        const folderText = this.getDirNameByPath(dir)
        const propName = prefixPath + '/' + folderText + '/'
        const subFolders = this.getFilterCurFolder(dir)
        const folderItems = subFolders.map((subFolderPath) => {
          const subText = this.getDirNameByPath(subFolderPath)
          const subSubFolderName = this.getFilterCurFolder(subFolderPath).map((item) =>
            this.getDirNameByPath(item)
          )
          return {
            text: this.formatText(this.capitalizeFirstLetter(subText), 'sidebar', 'dir'),
            collapsible: this.options.isCollapsible,
            collapsed: this.options.collapsed,
            items: [
              ...subSubFolderName.map((item) => ({
                text: this.formatText(this.capitalizeFirstLetter(item), 'sidebar', 'dir'),
                link: propName + subText + '/' + item + '/'
              })),
              ...this.getFilterCurMDFile(subFolderPath)
                .sort()
                .map((item) => {
                  const fullFilePath = subFolderPath + path.sep + item
                  return {
                    text: '- ' + this.formatText(this.getTitleFromMDFile(fullFilePath), 'sidebar', 'file'),
                    link: propName + subText + '/' + this.getFileNameByPath(item)
                  }
                })
            ]
          }
        })
        sidebar[propName] = [...folderItems]
        const subFiles = this.getFilterCurMDFile(dir)
        if (subFiles.length > 0) {
          subFiles.reverse().forEach((item) => {
            const fullFilePath = dir + path.sep + item
            if (Array.isArray(sidebar[propName])) {
              sidebar[propName].unshift({
                text: '- ' + this.formatText(this.getTitleFromMDFile(fullFilePath), 'sidebar', 'dir'),
                link: propName + item
              })
            }
          })
        }
      })
    return sidebar
  }

  getNavDeep(prefixLink: string, prefixPath: string): any[] {
    const docsPath = resolve(process.cwd(), prefixPath)
    const arr: DefaultTheme.NavItem[] = []
    this.getFilterCurFolder(docsPath).forEach((dir: string) => {
      const text = this.getDirNameByPath(dir)
      const subFolders = this.getFilterCurFolder(dir)
      const folderItems = subFolders.map((subFolderPath) => {
        const subFolderText = this.getDirNameByPath(subFolderPath)
        return {
          text: this.formatText(this.capitalizeFirstLetter(subFolderText), 'nav', 'dir'),
          items: this.getNavDeep(
            prefixLink + '/' + text + '/' + subFolderText,
            prefixPath + path.sep + text + path.sep + subFolderText
          )
        }
      })
      const fileItems = this.getFilterCurMDFile(dir).map((item) => {
        const subFileText = this.getFileNameByPath(item)
        const fullFilePath = dir + path.sep + item
        return {
          text: this.formatText(this.getTitleFromMDFile(fullFilePath), 'nav', 'file'),
          link: prefixLink + '/' + text + '/' + subFileText
        }
      })
      arr.push({
        text: this.formatText(this.capitalizeFirstLetter(text), 'nav', 'dir'),
        items: [...fileItems, ...folderItems]
      })
    })
    let files: string[] = this.getFilterCurMDFile(docsPath).map((item) =>
      this.getFileNameByPath(item)
    )
    if (files.length > 0) {
      files.forEach((item) => {
        const fullFilePath = prefixPath + path.sep + item + '.md'
        arr.push({
          text: this.formatText(this.getTitleFromMDFile(fullFilePath), 'nav', 'file'),
          link: prefixLink + '/' + item
        })
      })
    }
    return arr
  }
}
