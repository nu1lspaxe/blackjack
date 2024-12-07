const webpack = require('webpack');

process.env.MODE = process.argv.includes('-prod') ? 'production' : 'development';
process.env.WATCH = process.argv.includes('-w') ? true : false;

const config = require('../config/webpack.server.config.js');

const compiler = webpack(config);

if (process.env.MODE === 'production' || !process.env.WATCH) {
    compiler.run(function (err, stats) {
        if (err)
            return console.error(err);
        console.log(stats.toString({ colors: true }));
    });
} else {
    compiler.watch({ poll: 0 }, function (err, stats) {
        if (err)
            return console.error(err);
        console.log(stats.toString({ colors: true }));
    });
}