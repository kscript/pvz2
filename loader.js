const fileLoader = require('ks-file-loader').default
fileLoader({
    path: './src/assets/images/plants',
    ext: 'gif',
    // name: /(.*?)/,
    showDir: true,
    deep: true,
    readFile: false,
    loader(stats, data, done) {
        if (stats.type === 'dir') {
            console.log(`"${stats.name}",`)
        }
        // /^[A-Z]/.test(stats.name) && console.log(stats.name.slice(0, -4))
        done()
    },
    done() {
        // console.log('complete')
    }
})