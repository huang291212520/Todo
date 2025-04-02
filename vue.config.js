module.exports = {
    outputDir: 'dist',
    publicPath: './',
    pages: {
        index: {
            entry: './renderer.js',
            template: './index.html'
        }
    }
}
