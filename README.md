# @huawei-ide/codearts
用于集成CodeArts IDE Web

## 如何使用

1. 安装 @huawei-ide/codearts
   `npm install @huawei-ide/codearts`

2. 引入 codearts-ide-web
   `const codeartside = require('@huawei-ide/codearts');`

3. 预加载IDE
   其中id参数为挂载节点id，返回Promise：
   `codeartside.preload(id：string).then(() => {});`

4. 展示IDE
   `codeartside.show({width：string,height: string});`

5. 打开文件
   参数content为文件内容，类型为string，path是工程内文件的唯一路径，例如'src', 'src/tool', name为带后缀的文件名：
   ```
   codeartside.openFile({
        content: '## ReadME',
        path:'src',
        name: 'README.md'
    });
   ```

6. 销毁IDE
   `codeartside.dispose();`