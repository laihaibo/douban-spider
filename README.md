# douban-spider
a nodejs spider for douban movie

## todo
1. 下载图片失败

## fixed
1. 解决了图片下载4058问题，原因是没有img目录，所以读取不到里面的文件，通过引入mkdirp库，在downloadImg函数调用之前建立img文件夹得以解决